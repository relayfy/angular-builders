import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { executeXLF } from './xlf-merge';
import { executeXLF2 } from './xlf2-merge';
import { log } from './utils';

interface Options extends JsonObject {
  preventExtractI18n: boolean;
}

export default createBuilder(mergeI18nBuilder);

async function mergeI18nBuilder(
  options: Options,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const project = context.target?.project || '';
  const extractI18nTarget = { target: 'extract-i18n', project };
  const extractI18nOptions = await context.getTargetOptions(extractI18nTarget);

  const outputPath = extractI18nOptions.outputPath as string;
  const outFile = extractI18nOptions.outFile as string;
  const format = extractI18nOptions.format as 'xlf' | 'xlf2';

  if (!options?.preventExtractI18n) {
    log(`extract...`);
  
    const extractI18nRun = await context.scheduleTarget(extractI18nTarget, { outputPath, format, progress: false });
    const extractI18nResult = await extractI18nRun.result;
  
    if (!extractI18nResult.success) {
      return { success: false, error: `"extract-i18n" failed: ${extractI18nResult.error}` };
    }
  
    log(`...extracted successfully`);
  }

  if (['xlf', 'xlf2'].includes(format)) {
    log(`merge...`);
    const projectMetadata = await context.getProjectMetadata(project);
    const i18n = projectMetadata.i18n as JsonObject;
    const sourceLocale = i18n?.sourceLocale as string;
    const locales = i18n?.locales as JsonObject;
  
    if (locales) {
      Object.keys(locales)?.forEach(locale => {
        const file = locales[locale] as string;
        log(`merge ${format} - ${locale} (${file}) with ${sourceLocale} (${outFile})`);

        switch(format) {
          case 'xlf': executeXLF(outFile, file, locale);
          case 'xlf2': executeXLF2(outFile, file, locale);
        }
      });
    }
  
    log('...merged successfully.');
    return { success: true };
  }

  return { success: false, error: `format ${format} no support` };
}

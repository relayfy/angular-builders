import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { executeXLF } from './xlf-merge';
import { executeXLF2 } from './xlf2-merge';
import { log } from './utils';

interface Options extends JsonObject {
  buildTarget: string;
  format: 'xlf' | 'xlf2';
  progress: boolean;
  outputPath: string;
  outFile: string;
  i18nBuilder: string;
}

const builder: ReturnType<typeof createBuilder> = createBuilder(mergeI18nBuilder);
export default builder;

async function mergeI18nBuilder(
  options: Options,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const project = context.target?.project || '';
  const format = options.format;
  const progress = options.progress || false;
  const outputPath = options.outPath;
  const outFile = options.outFile;
  const i18nBuilder = options.i18nBuilder;

  log(`extract...`);

  const extractI18nRun = await context.scheduleBuilder(i18nBuilder, {
    buildTarget: options.buildTarget,
    outputPath,
    outFile,
    format,
    progress
}, {target: context.target, logger: context.logger.createChild('extract-i18n')});
  const extractI18nResult = await extractI18nRun.result;

  if (!extractI18nResult.success) {
    return { success: false, error: `"extract-i18n" failed: ${extractI18nResult.error}` };
  }

  log(`...extracted successfully`);

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
          case 'xlf': executeXLF(outFile, file, locale); break;
          case 'xlf2': executeXLF2(outFile, file, locale); break;
        }
      });
    }
  
    log('...merged successfully.');
    return { success: true };
  }

  return { success: false, error: `format ${format} no support` };
}

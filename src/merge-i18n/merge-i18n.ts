import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { rmSync } from 'fs';
import { concat } from './xlf-concat';
import { merge } from './xlf-merge';
import { log } from './utils';

interface Options extends JsonObject {
  preventExtractI18n: boolean;
}

export default createBuilder(copyFileBuilder);

async function copyFileBuilder(
  options: Options,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const project = context.target?.project || '';
  const extractI18nTarget = { target: 'extract-i18n', project };
  const extractI18nOptions = await context.getTargetOptions(extractI18nTarget);

  const outputPath = extractI18nOptions.outputPath as string;
  const outFile = extractI18nOptions.outFile as string;
  const format = extractI18nOptions.format;

  if (!options?.preventExtractI18n) {
    log(`extract i18n...`);
  
    const extractI18nRun = await context.scheduleTarget(extractI18nTarget, { outputPath, format, progress: false });
    const extractI18nResult = await extractI18nRun.result;
  
    if (!extractI18nResult.success) {
      return { success: false, error: `"extract-i18n" failed: ${extractI18nResult.error}` };
    }
  
    log(`...extracted i18n successfully`);
  }

  log(`merge i18n...`);

  const projectMetadata = await context.getProjectMetadata(project);
  const i18n = projectMetadata.i18n as JsonObject;
  const sourceLocale = i18n?.sourceLocale as string;
  const locales = i18n?.locales as JsonObject;

  const tmpCompactSourceLocalFile = `${outFile}.tmp`;

  if (locales) {
    concat(outFile, tmpCompactSourceLocalFile, sourceLocale);

    Object.keys(locales)?.forEach(locale => {
      const file = locales[locale] as string;
      log(`merge i18n ${sourceLocale} (${outFile}) with ${locale} (${file})`);
      merge(tmpCompactSourceLocalFile, file, locale);
    });

    rmSync(tmpCompactSourceLocalFile);
  }

  log('...merged i18n successfully.');
  return { success: true };
}

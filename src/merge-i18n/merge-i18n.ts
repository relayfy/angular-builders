import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

interface Options extends JsonObject {
  source: string;
  destination: string;
}

export default createBuilder(copyFileBuilder);

async function copyFileBuilder(
  options: Options,
  context: BuilderContext,
): Promise<BuilderOutput> {
  context.reportStatus(`Merge i18n ${options.source} to ${options.destination}.`);

  context.reportStatus('Done.');
  return { success: true };
}
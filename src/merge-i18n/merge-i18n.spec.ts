import { Architect, createBuilder } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { extractI18nTargetSpec, mergeI18nTargetSpec } from '../testing/test-utils';
import builder from './merge-i18n';

describe('Extract-i18n Builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost(__dirname);
    architect = new Architect(architectHost, registry);

    await architectHost.addBuilder('@angular-devkit/build-angular:extract-i18n', createBuilder(() => ({ success: true }))); // dummy builder
    await architectHost.addTarget(extractI18nTargetSpec, '@angular-devkit/build-angular:extract-i18n');
    await architectHost.addBuilder('@relayfy/angular-builders:merge-i18n', builder);
    await architectHost.addTarget(mergeI18nTargetSpec, '@relayfy/angular-builders:merge-i18n');
  });

  it('should do empty test', () => {
    expect(true).toBeTruthy();
  });

  // it('can merge-i18n xlf', async () => {
  //   // A "run" can have multiple outputs, and contains progress information.
  //   const run = await architect.scheduleTarget(mergeI18nTargetSpec, { preventExtractI18n: true });

  //   // The "result" member (of type BuilderOutput) is the next output.
  //   const output = await run.result;

  //   // Stop the builder from running. This stops Architect from keeping
  //   // the builder-associated states in memory, since builders keep waiting
  //   // to be scheduled.
  //   await run.stop();

  //   // Expect that the copied file is the same as its source.
  //   //expect(destinationContent).toBe(sourceContent);
  // });
});
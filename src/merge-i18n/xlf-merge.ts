import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { log } from './utils';
import { styleText } from 'node:util';
import { readFileSync, writeFileSync } from 'fs';

const parser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  stopNodes: ['*.source', '*.target']
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
  indentBy: '  ',
  stopNodes: ['*.source', '*.target'],
  processEntities: false
});

export const executeXLF = (sourceFile: string, targetFile: string, targetLocale: string) => {
  const sourceXML = readFileSync(sourceFile, 'utf-8');
  const targetXML = readFileSync(targetFile, 'utf-8');
  const mergedTargetXML = merge(sourceXML, targetXML, targetLocale);
  writeFileSync(targetFile, mergedTargetXML, 'utf-8');
}

export const merge = (sourceXML: string, targetXML: string = '', targetLocale: string): string => {
  const sourceXMLObj = parser.parse(sourceXML);
  const targetXMLObj = parser.parse(targetXML);

  const sourceTransUnits = getTransUnits(sourceXMLObj);
  const targetTransUnits = getTransUnits(targetXMLObj);

  const mergedTransUnits = mergeTransUnits(sourceTransUnits, targetTransUnits, targetLocale);
  return builder.build(updateTransUnits(sourceXMLObj, mergedTransUnits, targetLocale));
}

const mergeTransUnits = (sourceTransUnits: TransUnit[], targetTransUnits: TransUnit[], targetLocale: string) => {
  const merged = [...(sourceTransUnits || [])]?.map((sourceTransUnit: TransUnit) => {
    const match = targetTransUnits?.find(targetTransUnit => targetTransUnit['@_id'] === sourceTransUnit['@_id']);

    if (match) {
      return {
        '@_id': sourceTransUnit['@_id'],
        '@_datatype': sourceTransUnit['@_datatype'],
        source: sourceTransUnit.source,
        target: match.target,
        'context-group': sourceTransUnit['context-group']
      };
    } else {

      log(styleText('yellow', `${sourceTransUnit['@_id']} added for ${targetLocale}`));

      return {
        '@_id': sourceTransUnit['@_id'],
        '@_datatype': sourceTransUnit['@_datatype'],
        source: sourceTransUnit.source,
        target: 'NOT_TRANSLATED',
        'context-group': sourceTransUnit['context-group']
      }
    }
  });

  targetTransUnits?.forEach(targetTransUnit => {
    const removed = !sourceTransUnits?.find(sourceTransUnit => sourceTransUnit['@_id'] === targetTransUnit['@_id']);
    if (removed) {
      log(styleText('red', `${targetTransUnit['@_id']} removed for ${targetLocale}`));
    }
  });

  return merged;
}

const updateTransUnits = (xmlObj: any, transUnits: TransUnit[], targetLocale: string) => {
  return {
    ...xmlObj,
    xliff: {
      ...(xmlObj?.xliff || {}),
      file: {
        ...(xmlObj?.xliff?.file || {}),
        '@_target-language': targetLocale,
        body: {
          'trans-unit': transUnits
        }
      }
    }
  };
}

const getTransUnits = (xmlObj: any): TransUnit[] => {
  return xmlObj?.xliff?.file?.body?.['trans-unit'];
}

type TransUnit = {
  ['@_id']: string;
  ['@_datatype']: string;
  source: string;
  target: string;
  ['context-group']: any;
}

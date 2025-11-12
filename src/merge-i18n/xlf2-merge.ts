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

export const executeXLF2 = (sourceFile: string, targetFile: string, targetLocale: string) => {
  const sourceXML = readFileSync(sourceFile, 'utf-8');
  const targetXML = readFileSync(targetFile, 'utf-8');
  const mergedTargetXML = merge(sourceXML, targetXML, targetLocale);
  writeFileSync(targetFile, mergedTargetXML, 'utf-8');
}

export const merge = (sourceXML: string, targetXML: string = '', targetLocale: string): string => {
  const sourceXMLObj = parser.parse(sourceXML);
  const targetXMLObj = parser.parse(targetXML);

  const sourceUnits = getUnits(sourceXMLObj);
  const targetUnits = getUnits(targetXMLObj);

  const mergedUnits = mergeUnits(sourceUnits, targetUnits, targetLocale);
  return builder.build(updateUnits(sourceXMLObj, mergedUnits, targetLocale));
}

const mergeUnits = (sourceUnits: Unit[], targetUnits: Unit[], targetLocale: string) => {
  const merged = [...(sourceUnits || [])]?.map((sourceUnit: Unit) => {
    const match = targetUnits?.find(targetUnit => targetUnit['@_id'] === sourceUnit['@_id']);

    if (match) {
      return {
        '@_id': sourceUnit['@_id'],
        'notes': sourceUnit.notes,
        segment: {
          ...sourceUnit.segment,
          target: match.segment.target,
        }
      };
    } else {

      log(styleText('yellow', `${sourceUnit['@_id']} added for ${targetLocale}`));

      return {
        '@_id': sourceUnit['@_id'],
        'notes': sourceUnit.notes,
        segment: {
          ...sourceUnit.segment,
          target: 'NOT_TRANSLATED'
        }
      }
    }
  });

  targetUnits?.forEach(targetUnit => {
    const removed = !sourceUnits?.find(sourceUnit => sourceUnit['@_id'] === targetUnit['@_id']);
    if (removed) {
      log(styleText('red', `${targetUnit['@_id']} removed for ${targetLocale}`));
    }
  });

  return merged;
}

const updateUnits = (xmlObj: any, units: Unit[], targetLocale: string) => {
  return {
    ...xmlObj,
    xliff: {
      ...(xmlObj?.xliff || {}),
      ['@_trgLang']: targetLocale,
      file: {
        ...(xmlObj?.xliff?.file || {}),
        unit: units
      }
    }
  };
}

const getUnits = (xmlObj: any): Unit[] => {
  return xmlObj?.xliff?.file?.unit;
}

type Unit = {
  ['@_id']: string;
  notes: any;
  segment: {
    source: string;
    target: string;
  }
}

import { writeFileSync } from 'fs';
import { js2xml } from 'xml-js';
import { cleanup, combine, getFrame, getTransUnits, log, revertTextPlaceholder, uniqueSorted } from './utils';

export function concat(src: string, target: string, locale: string) {
  log(`Concat ${locale} translation file`);
  
  const transUnitsA = getTransUnits(src);
  
  const frame = getFrame(src);
  
  const transUnitsB = uniqueSorted(transUnitsA);
  const transUnitsC = cleanup(transUnitsB);
  
  const result = combine(frame, transUnitsC);
  
  const transUnitsXml = js2xml(result, {
      spaces: 2,
      fullTagEmptyElement: true,
      textFn: function (value) {
          return revertTextPlaceholder(value);
      }
  });
  
  writeFileSync(target, transUnitsXml, 'utf8');
  
  log(`Finished concatenate compact ${locale} translation file`);
};

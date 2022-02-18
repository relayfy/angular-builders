import { yellow, red } from 'chalk';
import { writeFileSync } from 'fs';
import { js2xml } from 'xml-js';

import { cleanup, combine, getFrame, getTransUnits, log, revertTextPlaceholder, uniqueSorted } from './utils';

export function merge(source: string, target: string, targetLanguage: string) {
    log(`merging ${targetLanguage}`);
    const newTargetElement = { type: 'element', name: 'target', elements: [ { type: 'text', text: 'NOT_TRANSLATED' } ] };

    const sourceTransUnits = uniqueSorted(getTransUnits(source));
    const targetTransUnitsObject: any = transUnitsObject(uniqueSorted(getTransUnits(target)));
    const newTargetTransUnitsObject: any = {};

    for (let i = 0; i < sourceTransUnits.length; i++) {
        const id = sourceTransUnits[i].attributes.id;
        const targetElement = targetTransUnitsObject[id] && targetTransUnitsObject[id].elements.find((element: any) => element.name === 'target');

        if (!targetElement) {
            log(yellow(`Added ${id} for ${targetLanguage}`));
        }

        // if no target element exists create new one
        newTargetTransUnitsObject[id] = {
            ...sourceTransUnits[i],
            elements: [
                ...sourceTransUnits[i].elements,
                targetElement || newTargetElement
            ]
        };
    }

    for (const id of Object.keys(targetTransUnitsObject)) {
        if (!newTargetTransUnitsObject[id]) {
            log(red(`Removed ${id} for ${targetLanguage}`));
        }
    }

    const frame = getFrame(target);
    frame.elements[0].elements[0].attributes['target-language'] = targetLanguage;

    const transUnits = cleanup(Object.values(newTargetTransUnitsObject));
    const result = combine(frame, transUnits);

    const transUnitsXml = js2xml(result, {
        spaces: 2,
        fullTagEmptyElement: true,
        textFn: function(value) {
            return revertTextPlaceholder(value);
        }
    });

    writeFileSync(target, transUnitsXml, 'utf8');
}

function transUnitsObject(transUnits: any[]) {
    const transUnitO: any = {};

    for (const transUnit of transUnits) {
        transUnitO[transUnit.attributes.id] = transUnit;
    }

    return transUnitO;
}
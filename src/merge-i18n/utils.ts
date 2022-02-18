import { gray } from 'chalk';
import { readFileSync } from 'fs';
import { js2xml, xml2js } from 'xml-js';

const GT_PLACEHOLDER = '##GT##';
const LT_PLACEHOLDER = '##LT##';

/**
 * Extracts xml frame of filePath into js object and removes targetUnits.
 * @param {*} filePath 
 */
 export function getFrame(filePath: string) {
    const xlf = readFileSync(filePath, 'utf8');
    const xlfJs = xml2js(xlf);
    xlfJs.elements[0].elements[0].elements[0].elements = [];

    return xlfJs;
}

/**
 * Extracts xml targetUnits of filePath into js object.
 * @param {*} filePath 
 */
 export function getTransUnits(filePath: string) {
    const xlf = readFileSync(filePath, 'utf8');
    const xlfJs = xml2js(xlf);

    return xlfJs.elements[0].elements[0].elements[0].elements;
}

/**
 * Append transUnits into given frame.
 * @param {*} frame 
 * @param {*} transUnits 
 */
 export function combine(frame: any, transUnits: any) {
    frame.elements[0].elements[0].elements[0].elements = transUnits;

    return frame;
}

/**
 * Removes duplicate entries inside transUnits and returns sorted array.
 * @param {*} transUnits 
 */
 export function uniqueSorted(transUnits: any[]) {
    const transUnitObject: any = {};

    for (const transUnit of transUnits) {
        transUnitObject[transUnit.attributes.id] = transUnit;
    }

    const uniqueTransUnits: any = Object.values(transUnitObject);

    return uniqueTransUnits.sort(function(a: any, b: any) {
        const x = a.attributes.id;
        const y = b.attributes.id;
        return x < y ? -1 : x > y ? 1 : 0;;
    });
}

/**
 * Removes any element inside targetUnits except source and target elements.
 * Converts inner elements of source or target into simple text elements although
 * since this elements should be inlined and not formatted. So we need to add placeholders
 * for '>' and '<' chars. Will be converted back in textFn inside js2xml
 * @param {*} transUnits 
 */
export function cleanup(transUnits: any[]) {
    for (const transUnit of transUnits) {
        transUnit.elements = transUnit.elements.filter((element: any) => (element.name === 'source' || element.name === 'target'));

        for (const sourceOrTargetElement of transUnit.elements) {
            for (const element of sourceOrTargetElement.elements) {
                if (element.type !== 'text') {
                    // ESCAPED TEXT
                    let text = js2xml({ elements: [element] }, { spaces: 2 });
                    text = addTextPlaceholder(text);
    
                    element.text = text;
                    element.type = 'text';
                    delete element.attributes;
                }
            }
        }
    }

    return transUnits;
}

export function addTextPlaceholder(text: string) {
    return text.replace(new RegExp('<', 'g'), LT_PLACEHOLDER).replace(new RegExp('>', 'g'), GT_PLACEHOLDER);
}

export function revertTextPlaceholder(text: string) {
    return text.replace(new RegExp(LT_PLACEHOLDER,"g"), '<').replace(new RegExp(GT_PLACEHOLDER,"g"), '>');
}

export function log(text: string) {
    console.log(`${gray('[Merge-i18n]')} ${text}`);
}

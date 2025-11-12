import { styleText } from 'node:util';

export function log(text: string) {
  console.log(`${styleText('gray', '[Merge-i18n]')} ${text}`);
}

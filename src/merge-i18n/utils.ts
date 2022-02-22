import { gray } from 'chalk';

export function log(text: string) {
  console.log(`${gray('[Merge-i18n]')} ${text}`);
}

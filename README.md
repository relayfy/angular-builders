# @relayfy/angular-builders

[![Node.js CI](https://github.com/relayfy/angular-builders/actions/workflows/node.js.yml/badge.svg)](https://github.com/relayfy/angular-builders/actions/workflows/node.js.yml)
![Codecov](https://img.shields.io/codecov/c/gh/relayfy/angular-builders)
![npm](https://img.shields.io/npm/dm/@relayfy/angular-builders)
![npm version](https://img.shields.io/npm/v/@relayfy/angular-builders)
![NPM](https://img.shields.io/npm/l/@relayfy/angular-builders)

## Builders
### merge-i18n
Merge-i18n is an extension of the extract-i18n command. It can be used separately or run extract-i18n as a pre-command.

**Installation**

`npm i @relayfy/angular-builders`


**Setup**

angular.json
```diff
{
  ...
  "projects": {
    ...
    "demo": {
      ...
      "i18n": {
        "sourceLocale": "en-US",
        "locales": {
          "de-CH": "src/locale/translations.de-CH.xlf",
          "fr-CH": "src/locale/translations.fr-CH.xlf"
        }
      },
      ...
      "architect": {
        ...
        "extract-i18n": {
+          "builder": "@relayfy/angular-builders:merge-i18n",
-          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "demo:build",
            "format": "xlf",
            "outFile": "src/locale/translations.en-US.xlf",
+            "i18nBuilder": "@angular-devkit/build-angular:extract-i18n"
          }
        },
        ...
      }
    }
  }
}
```


**Options**
| Option  | Default | Description |
| ------------- | ------------- | ------------- |
| buildTarget       | `undefined`                                  | `inherit` from `extract-i18n`: A browser builder target to extract i18n messages in the format of `project:target[:configuration]`. You can also pass in more than one configuration name as a comma-separated list. Example: `project:target:production,staging`. |
| format              | `xlf`                                        | `inherit` from `extract-i18n`: Output format for the generated file. |
| progress            | `true`                                       | `inherit` from `extract-i18n`: By default, extract-i18n is executed before merge-i18n. You can prevent this with preventExtractI18n = true. |
| outputPath          | `undefined`                                  | `inherit` from `extract-i18n`: Path where output will be placed. |
| outFile             | `undefined`                                  | `inherit` from `extract-i18n`: Name of the file to output. |
| i18nBuilder         | `@angular-devkit/build-angular:extract-i18n` | The i18n builder to execute before merge. |


**Limits**

Currently only the `xlf` and `xlf2` format is supported. Others will follow.

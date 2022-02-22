# @relayfy/angular-builders

![npm version](https://img.shields.io/npm/v/@relayfy/angular-builders)

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
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "demo:build",
            "outFile": "src/locale/translations.en-US.xlf",
            "format": "xlf"
          }
        },
+        "merge-i18n": {
+          "builder": "@relayfy/angular-builders:merge-i18n",
+        },
        ...
      }
    }
  }
}
```


**Options**
| Option  | Default | Description |
| ------------- | ------------- | ------------- |
| preventExtractI18n  | false  | By default, extract-i18n is executed before merge-i18n. You can prevent this with preventExtractI18n = true.  |


**Limits**

Currently only the `xlf` and `xlf2` format is supported. Others will follow.

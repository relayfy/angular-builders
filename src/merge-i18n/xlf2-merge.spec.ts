import { merge } from "./xlf2-merge";

const XLF_SOURCE = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US">
  <file id="ngi18n" original="ng.template">
    <unit id="ID_1">
      <notes>
        <note category="location">the/file/path/1:16</note>
      </notes>
      <segment>
        <source>Source ID_1</source>
      </segment>
    </unit>
    <unit id="ID_2">
      <notes>
        <note category="location">the/file/path/2:16</note>
      </notes>
      <segment>
        <source>Source ID_2</source>
      </segment>
    </unit>
    <unit id="ID_3">
      <notes>
        <note category="location">the/file/path/3:16</note>
      </notes>
      <segment>
        <source>Source ID_3</source>
      </segment>
    </unit>
  </file>
</xliff>
`;

const XLF_TARGET = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-CH">
  <file id="ngi18n" original="ng.template">
    <unit id="ID_1">
      <notes>
        <note category="location">the/file/path/1:16</note>
      </notes>
      <segment>
        <source>Source ID_1</source>
        <target>Target ID_1</target>
      </segment>
    </unit>
    <unit id="ID_3">
      <notes>
        <note category="location">the/file/path/3:16</note>
      </notes>
      <segment>
        <source>Source ID_3</source>
        <target>Target ID_3</target>
      </segment>
    </unit>
    <unit id="ID_5">
      <notes>
        <note category="location">the/file/path/5:16</note>
      </notes>
      <segment>
        <source>Source ID_5</source>
        <target>Target ID_5</target>
      </segment>
    </unit>
  </file>
</xliff>
`;

const XLF_TARGET_RESULT = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-CH">
  <file id="ngi18n" original="ng.template">
    <unit id="ID_1">
      <notes>
        <note category="location">the/file/path/1:16</note>
      </notes>
      <segment>
        <source>Source ID_1</source>
        <target>Target ID_1</target>
      </segment>
    </unit>
    <unit id="ID_2">
      <notes>
        <note category="location">the/file/path/2:16</note>
      </notes>
      <segment>
        <source>Source ID_2</source>
        <target>NOT_TRANSLATED</target>
      </segment>
    </unit>
    <unit id="ID_3">
      <notes>
        <note category="location">the/file/path/3:16</note>
      </notes>
      <segment>
        <source>Source ID_3</source>
        <target>Target ID_3</target>
      </segment>
    </unit>
  </file>
</xliff>
`;

const XLF_TARGET_EMPTY_RESULT = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en-US" trgLang="de-CH">
  <file id="ngi18n" original="ng.template">
    <unit id="ID_1">
      <notes>
        <note category="location">the/file/path/1:16</note>
      </notes>
      <segment>
        <source>Source ID_1</source>
        <target>NOT_TRANSLATED</target>
      </segment>
    </unit>
    <unit id="ID_2">
      <notes>
        <note category="location">the/file/path/2:16</note>
      </notes>
      <segment>
        <source>Source ID_2</source>
        <target>NOT_TRANSLATED</target>
      </segment>
    </unit>
    <unit id="ID_3">
      <notes>
        <note category="location">the/file/path/3:16</note>
      </notes>
      <segment>
        <source>Source ID_3</source>
        <target>NOT_TRANSLATED</target>
      </segment>
    </unit>
  </file>
</xliff>
`;

describe('xlf2', () => {
  describe('execute', () => {
    it('should return merged result', async() => {
      expect(merge(XLF_SOURCE, XLF_TARGET, 'de-CH')).toEqual(XLF_TARGET_RESULT);
    });
  });
  describe('execute', () => {
    it('should return merged result', async() => {
      expect(merge(XLF_SOURCE, '', 'de-CH')).toEqual(XLF_TARGET_EMPTY_RESULT);
    });
  });
});

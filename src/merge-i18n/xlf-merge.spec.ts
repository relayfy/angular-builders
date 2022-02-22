import { merge } from "./xlf-merge";

const XLF_SOURCE = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="ID_1" datatype="html">
        <source>Source ID_1</source>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/1</context>
          <context context-type="linenumber">34,35</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_2" datatype="html">
        <source>Source ID_2</source>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/2</context>
          <context context-type="linenumber">3</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_3" datatype="html">
        <source>Source ID_3<a name="test">Hallo</a></source>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/3</context>
          <context context-type="linenumber">12</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const XLF_TARGET = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-CH">
    <body>
      <trans-unit id="ID_1" datatype="html">
        <source>Source ID_1</source>
        <target>Target ID_1</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/1</context>
          <context context-type="linenumber">34,35</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_3" datatype="html">
        <source>Source ID_3<a name="test">Hallo</a></source>
        <target>Target ID_3<a name="test">Hallo</a></target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/3</context>
          <context context-type="linenumber">12</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_5" datatype="html">
        <source>Source ID_5</source>
        <target>Target ID_5</target>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const XLF_TARGET_RESULT = `<?xml version="1.0" encoding="UTF-8"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-CH">
    <body>
      <trans-unit id="ID_1" datatype="html">
        <source>Source ID_1</source>
        <target>Target ID_1</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/1</context>
          <context context-type="linenumber">34,35</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_2" datatype="html">
        <source>Source ID_2</source>
        <target>NOT_TRANSLATED</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/2</context>
          <context context-type="linenumber">3</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_3" datatype="html">
        <source>Source ID_3<a name="test">Hallo</a></source>
        <target>Target ID_3<a name="test">Hallo</a></target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/3</context>
          <context context-type="linenumber">12</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

const XLF_TARGET_EMPTY_RESULT = `<?xml version="1.0" encoding="UTF-8"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-CH">
    <body>
      <trans-unit id="ID_1" datatype="html">
        <source>Source ID_1</source>
        <target>NOT_TRANSLATED</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/1</context>
          <context context-type="linenumber">34,35</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_2" datatype="html">
        <source>Source ID_2</source>
        <target>NOT_TRANSLATED</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/2</context>
          <context context-type="linenumber">3</context>
        </context-group>
      </trans-unit>
      <trans-unit id="ID_3" datatype="html">
        <source>Source ID_3<a name="test">Hallo</a></source>
        <target>NOT_TRANSLATED</target>
        <context-group purpose="location">
          <context context-type="sourcefile">the/file/path/3</context>
          <context context-type="linenumber">12</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

describe('xlf', () => {
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

export interface Link {
  name: string
  href: string
  label?: string
  category?: ToolCategory
  elite?: boolean
}

export enum ToolCategory {
  Playground,
  Generator,
  Converter,
  UnitConverter,
  Validator,
  String,
  Encode,
  Diff,
  Minifier,
}

export const Grids: Array<Link> = [
  {
    name: 'postwoman',
    href: 'https://postwoman.io',
    label: 'http api test',
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: 'CodeSandbox',
    href: 'https://codesandbox.io',
    label: 'javascript html css react',
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: 'RegExr',
    href: 'https://regexr.com',
    label: 'regular',
    category: ToolCategory.Playground,
  },
  {
    name: 'Typescript Playground',
    href: 'https://www.typescriptlang.org/play',
    label: 'javascript',
    category: ToolCategory.Playground,
  },
  {
    name: '.NET Fiddle',
    href: 'https://dotnetfiddle.net',
    label: 'c#',
    category: ToolCategory.Playground,
  },
  {
    name: 'prettier',
    href: 'https://prettier.io/playground/',
    label: 'javascript format',
    category: ToolCategory.Playground,
  },
  {
    name: 'Babel',
    href: 'https://babeljs.io/repl',
    label: 'javascript',
    category: ToolCategory.Playground,
  },
  {
    name: 'Sass Meister',
    href: 'https://www.sassmeister.com',
    label: 'css scss',
    category: ToolCategory.Playground,
  },
  {
    name: 'Kotlin',
    href: 'https://repl.it/languages/kotlin',
    label: 'java',
    category: ToolCategory.Playground,
  },
  {
    name: 'Lua',
    href: 'https://repl.it/languages/lua',
    category: ToolCategory.Playground,
  },
  {
    name: 'Ruby',
    href: 'https://repl.it/languages/ruby',
    category: ToolCategory.Playground,
  },
  {
    name: 'Python',
    href: 'https://repl.it/languages/python3',
    category: ToolCategory.Playground,
  },
  {
    name: 'Nodejs',
    href: 'https://repl.it/languages/nodejs',
    label: 'javascript',
    category: ToolCategory.Playground,
  },
  {
    name: 'Go',
    href: 'https://repl.it/languages/go',
    category: ToolCategory.Playground,
  },
  {
    name: 'C++',
    href: 'https://repl.it/languages/cpp',
    category: ToolCategory.Playground,
  },
  {
    name: 'C',
    href: 'https://repl.it/languages/c',
    category: ToolCategory.Playground,
  },
  {
    name: 'FSharp',
    href: 'https://repl.it/languages/fsharp',
    label: '.net',
    category: ToolCategory.Playground,
  },
  {
    name: 'Rust',
    href: 'https://repl.it/languages/rust',
    category: ToolCategory.Playground,
  },
  {
    name: 'Swift',
    href: 'https://repl.it/languages/Swift',
    label: 'ios apple',
    category: ToolCategory.Playground,
  },
  {
    name: 'Crystal',
    href: 'https://repl.it/languages/crystal',
    category: ToolCategory.Playground,
  },
  {
    name: 'Elixir',
    href: 'https://repl.it/languages/elixir',
    label: 'erlang',
    category: ToolCategory.Playground,
  },
  {
    name: 'Dart',
    href: 'https://repl.it/languages/dart',
    label: 'javascript',
    category: ToolCategory.Playground,
  },
  {
    name: 'SQLite',
    href: 'https://repl.it/languages/sqlite',
    category: ToolCategory.Playground,
  },
  {
    name: 'Java',
    href: 'https://repl.it/languages/java10',
    category: ToolCategory.Playground,
  },
  {
    name: 'PHP CLI',
    href: 'https://repl.it/languages/php_cli',
    category: ToolCategory.Playground,
  },

  {
    name: 'CSS3 Generator',
    href: 'https://enjoycss.com',
    label: 'animation',
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: 'NGINX Config',
    href: 'https://www.digitalocean.com/community/tools/nginx',
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: 'Stylelint Generator',
    href: 'https://maximgatilin.github.io/stylelint-config',
    label: 'css',
    category: ToolCategory.Generator,
  },
  {
    name: 'Random Word Generator',
    href: 'https://codebeautify.org/random-word-generator',
    category: ToolCategory.Generator,
  },
  {
    name: 'NTLM Hash Generator',
    href: 'https://codebeautify.org/ntlm-hash-generator',
    category: ToolCategory.Generator,
  },
  {
    name: 'Password Generator',
    href: 'https://codebeautify.org/password-generator',
    category: ToolCategory.Generator,
  },
  {
    name: 'Credit Card Fake Number',
    href: 'https://codebeautify.org/credit-card-fake-number-generator',
    category: ToolCategory.Generator,
  },
  {
    name: 'Sharelink Generator',
    href: 'https://codebeautify.org/share-link-generator',
    category: ToolCategory.Generator,
  },

  {
    name: 'File Converter',
    href: 'https://convertio.co',
    category: ToolCategory.Converter,
    elite: true,
  },
  {
    name: 'Data Converter',
    href: 'https://dataconverter.curiousconcept.com',
    category: ToolCategory.Converter,
    elite: true,
  },
  {
    name: 'Word to HTML Converter',
    href: 'https://codebeautify.org/word-to-html-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'Online Tableizer',
    href: 'https://codebeautify.org/tableizer',
    category: ToolCategory.Converter,
  },
  {
    name: 'HTML to CSV Converter',
    href: 'https://codebeautify.org/html-to-csv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HTML to TSV Converter',
    href: 'https://codebeautify.org/html-to-tsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'Image to Base64',
    href: 'https://codebeautify.org/image-to-base64-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'Base64 to Image',
    href: 'https://codebeautify.org/base64-to-image-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'Date Calculater',
    href: 'https://codebeautify.org/date-time-calculater',
    category: ToolCategory.Converter,
  },
  {
    name: 'EXCEL to HTML',
    href: 'https://codebeautify.org/excel-to-html',
    category: ToolCategory.Converter,
  },
  {
    name: 'EXCEL to XML',
    href: 'https://codebeautify.org/excel-to-xml',
    category: ToolCategory.Converter,
  },
  {
    name: 'EXCEL to JSON',
    href: 'https://codebeautify.org/excel-to-json',
    category: ToolCategory.Converter,
  },
  {
    name: 'CSV to HTML',
    href: 'https://codebeautify.org/csv-to-html-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CSV to TSV',
    href: 'https://codebeautify.org/csv-to-tsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'JSON to CSV',
    href: 'https://codebeautify.org/json-to-csv',
    category: ToolCategory.Converter,
  },
  {
    name: 'JSON to TSV',
    href: 'https://codebeautify.org/json-to-tsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'XML to CSV',
    href: 'https://codebeautify.org/xml-to-csv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'XML to TSV',
    href: 'https://codebeautify.org/xml-to-tsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CSV to MULTILINE DATA',
    href: 'https://codebeautify.org/csv-to-multi-line-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CSV to SQL',
    href: 'https://codebeautify.org/csv-to-sql-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'SQL to CSV',
    href: 'https://codebeautify.org/sql-to-csv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'SQL to JSON',
    href: 'https://codebeautify.org/sql-to-json-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'SQL to XML',
    href: 'https://codebeautify.org/sql-to-xml-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'SQL to YAML',
    href: 'https://codebeautify.org/sql-to-yaml-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'SQL to HTML',
    href: 'https://codebeautify.org/sql-to-html-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'OPML to JSON',
    href: 'https://codebeautify.org/opml-to-json-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HEX to Pantone',
    href: 'https://codebeautify.org/hex-to-pantone-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'RGB to Pantone',
    href: 'https://codebeautify.org/rgb-to-pantone-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HSV to Pantone',
    href: 'https://codebeautify.org/hsv-to-pantone-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CMYK to Pantone',
    href: 'https://codebeautify.org/cmyk-to-pantone-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CMYK to HEX',
    href: 'https://codebeautify.org/cmyk-to-hex-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CMYK to RGB',
    href: 'https://codebeautify.org/cmyk-to-rgb-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CMYK to HSV',
    href: 'https://codebeautify.org/cmyk-to-hsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HSV to HEX',
    href: 'https://codebeautify.org/hsv-to-hex-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HSV to RGB',
    href: 'https://codebeautify.org/hsv-to-rgb-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HSV to CMYK',
    href: 'https://codebeautify.org/hsv-to-cmyk-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HEX to HSV',
    href: 'https://codebeautify.org/hex-to-hsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'RGB to HEX',
    href: 'https://codebeautify.org/rgb-to-hex-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'RGB to HSV',
    href: 'https://codebeautify.org/rgb-to-hsv-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'RGB to CMYK',
    href: 'https://codebeautify.org/rgb-to-cmyk-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HEX to RGB',
    href: 'https://codebeautify.org/hex-to-rgb-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'HEX to CMYK',
    href: 'https://codebeautify.org/hex-to-cmyk-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'JSON to HTML',
    href: 'https://codebeautify.org/json-to-html-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'XML to HTML',
    href: 'https://codebeautify.org/xml-to-html-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'JSON to Excel',
    href: 'https://codebeautify.org/json-to-excel-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'XML to Excel',
    href: 'https://codebeautify.org/xml-to-excel-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'CSV to Excel',
    href: 'https://codebeautify.org/csv-to-excel-converter',
    category: ToolCategory.Converter,
  },
  {
    name: 'YAML to Excel',
    href: 'https://codebeautify.org/yaml-to-excel-converter',
    category: ToolCategory.Converter,
  },

  {
    name: 'All NumbersConverter',
    href: 'https://codebeautify.org/all-number-converter',
    category: ToolCategory.UnitConverter,
    elite: true,
  },
  {
    name: 'NUMBER to WORD',
    href: 'https://codebeautify.org/number-to-word-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'String to Hex',
    href: 'https://codebeautify.org/string-hex-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Hex to String',
    href: 'https://codebeautify.org/hex-string-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'String to Binary',
    href: 'https://codebeautify.org/string-binary-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Binary to String',
    href: 'https://codebeautify.org/binary-string-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Case Converter',
    href: 'https://codebeautify.org/case-converter',
    category: ToolCategory.UnitConverter,
  },

  {
    name: 'Length Converter',
    href: 'https://codebeautify.org/length-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Weight Converter',
    href: 'https://codebeautify.org/weight-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Volume Converter',
    href: 'https://codebeautify.org/volume-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Area Converter',
    href: 'https://codebeautify.org/area-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Temperature Converter',
    href: 'https://codebeautify.org/temperature-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Density Converter',
    href: 'https://codebeautify.org/density-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Electric Current Converter',
    href: 'https://codebeautify.org/electric-current-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Speed Converter',
    href: 'https://codebeautify.org/speed-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Angle Converter',
    href: 'https://codebeautify.org/angle-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Bytes/Bits Converter',
    href: 'https://codebeautify.org/bytes-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Energy Converter',
    href: 'https://codebeautify.org/energy-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Force Converter',
    href: 'https://codebeautify.org/force-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Fuel Converter',
    href: 'https://codebeautify.org/fuel-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Mass Converter',
    href: 'https://codebeautify.org/mass-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Power Converter',
    href: 'https://codebeautify.org/power-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Pressure Converter',
    href: 'https://codebeautify.org/pressure-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Time Converter',
    href: 'https://codebeautify.org/time-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Astronomical Converter',
    href: 'https://codebeautify.org/astronomical-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Frequency Converter',
    href: 'https://codebeautify.org/frequency-converter',
    category: ToolCategory.UnitConverter,
  },
  {
    name: 'Unix Timestamp Converter',
    href: 'https://codebeautify.org/unix-time-stamp-converter',
    category: ToolCategory.UnitConverter,
  },

  {
    name: 'Glob Test',
    href: 'https://www.digitalocean.com/community/tools/glob',
    category: ToolCategory.Validator,
    elite: true,
  },
  {
    name: 'JSON Validator',
    href: 'https://jsonformatter.curiousconcept.com',
    category: ToolCategory.Validator,
    elite: true,
  },
  {
    name: 'JSON Path Tester',
    href: 'https://jsonpath.curiousconcept.com',
    category: ToolCategory.Validator,
  },
  {
    name: 'XPath Tester',
    href: 'https://xpath.curiousconcept.com/',
    category: ToolCategory.Validator,
  },
  {
    name: 'CSS Validator',
    href: 'https://codebeautify.org/cssvalidate',
    category: ToolCategory.Validator,
  },
  {
    name: 'JAVASCRIPT Validator',
    href: 'https://codebeautify.org/jsvalidate',
    category: ToolCategory.Validator,
  },
  {
    name: 'XML Validator',
    href: 'https://codebeautify.org/xmlvalidator',
    category: ToolCategory.Validator,
  },
  {
    name: 'API Test',
    href: 'https://codebeautify.org/api-test',
    category: ToolCategory.Validator,
  },
  {
    name: 'YAML Validator',
    href: 'https://codebeautify.org/yaml-validator',
    category: ToolCategory.Validator,
  },
  {
    name: 'Credit Card Validator',
    href: 'https://codebeautify.org/credit-card-validate',
    category: ToolCategory.Validator,
  },
  {
    name: 'Responsive Website Tester',
    href: 'https://codebeautify.org/responsive-website-tester',
    category: ToolCategory.Validator,
  },
  {
    name: 'Broken Link Checker',
    href: 'https://codebeautify.org/broken-link-checker',
    category: ToolCategory.Validator,
  },

  {
    name: 'String Builder',
    href: 'https://codebeautify.org/string-builder',
    category: ToolCategory.String,
  },
  {
    name: 'WORD COUNTER',
    href: 'https://codebeautify.org/wordcounter',
    category: ToolCategory.String,
  },
  {
    name: 'Reverse String',
    href: 'https://codebeautify.org/reverse-string',
    category: ToolCategory.String,
  },
  {
    name: 'Delimited Text Extractor ',
    href: 'https://codebeautify.org/delimited-text-extractor',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Accents ',
    href: 'https://codebeautify.org/remove-accents',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Duplicate Lines',
    href: 'https://codebeautify.org/remove-duplicate-lines',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Empty Lines',
    href: 'https://codebeautify.org/remove-empty-lines',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Extra Spaces ',
    href: 'https://codebeautify.org/remove-extra-spaces',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Line Breaks',
    href: 'https://codebeautify.org/remove-line-breaks',
    category: ToolCategory.String,
  },
  {
    name: 'Remove Lines Containing',
    href: 'https://codebeautify.org/remove-lines-containing',
    category: ToolCategory.String,
  },
  {
    name: 'Sort Text Lines',
    href: 'https://codebeautify.org/sort-text-lines',
    category: ToolCategory.String,
  },

  {
    name: 'HTML Encode',
    href: 'https://codebeautify.org/html-encode-string',
    category: ToolCategory.Encode,
  },
  {
    name: 'HTML Decode',
    href: 'https://codebeautify.org/html-decode-string',
    category: ToolCategory.Encode,
  },
  {
    name: 'Base64-Encode',
    href: 'https://codebeautify.org/base64-encode',
    category: ToolCategory.Encode,
  },
  {
    name: 'Base64-Decode',
    href: 'https://codebeautify.org/base64-decode',
    category: ToolCategory.Encode,
  },
  {
    name: 'URL-Encode',
    href: 'https://codebeautify.org/url-encode-string',
    category: ToolCategory.Encode,
  },
  {
    name: 'URL-Decode',
    href: 'https://codebeautify.org/url-decode-string',
    category: ToolCategory.Encode,
  },

  {
    name: 'HTML Escape',
    href: 'https://codebeautify.org/html-escape-unescape',
    category: ToolCategory.Encode,
  },
  {
    name: 'XML Escape',
    href: 'https://codebeautify.org/xml-escape-unescape',
    category: ToolCategory.Encode,
  },
  {
    name: 'Javascript Escape',
    href: 'https://codebeautify.org/javascript-escape-unescape',
    category: ToolCategory.Encode,
  },
  {
    name: 'CSV Escape',
    href: 'https://codebeautify.org/csv-escape-unescape',
    category: ToolCategory.Encode,
  },
  {
    name: 'SQL Escape',
    href: 'https://codebeautify.org/sql-escape-unescape',
    category: ToolCategory.Encode,
  },
  {
    name: 'Un-Google Link',
    href: 'https://codebeautify.org/un-google-link',
    category: ToolCategory.Encode,
  },
  {
    name: 'Encryption-Decryption',
    href: 'https://codebeautify.org/encrypt-decrypt',
    category: ToolCategory.Encode,
  },

  {
    name: 'File Difference',
    href: 'https://codebeautify.org/file-diff',
    category: ToolCategory.Diff,
  },
  {
    name: 'JSON Diff',
    href: 'https://codebeautify.org/json-diff',
    category: ToolCategory.Diff,
  },
  {
    name: 'XML Diff',
    href: 'https://codebeautify.org/xml-diff',
    category: ToolCategory.Diff,
  },

  {
    name: 'Json Minifier',
    href: 'https://codebeautify.org/jsonminifier',
    category: ToolCategory.Minifier,
  },
  {
    name: 'Css Minifier',
    href: 'https://codebeautify.org/css-beautify-minify',
    category: ToolCategory.Minifier,
  },
  {
    name: 'Text Minifier',
    href: 'https://codebeautify.org/text-minifier',
    category: ToolCategory.Minifier,
  },

  {
    name: 'DNS Lookup',
    href: 'https://www.digitalocean.com/community/tools/dns',
    elite: true,
  },

  {
    name: 'Lorem-Ipsum',
    href: 'https://codebeautify.org/lorem-ipsum',
  },
  {
    name: 'IP to Hostname',
    href: 'https://codebeautify.org/ip-to-hostname',
  },
  {
    name: 'MX Lookup',
    href: 'https://codebeautify.org/mx-lookup',
  },
  {
    name: 'Nameserver Lookup',
    href: 'https://codebeautify.org/name-server-lookup',
  },
  {
    name: 'Open Port Checker',
    href: 'https://codebeautify.org/open-port-checker',
  },
]

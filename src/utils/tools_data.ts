export interface Link {
  name: string
  href: string
  label?: string
  category?: ToolCategory
  elite?: boolean
  title?: string
}

export enum ToolCategory {
  Playground,
  PlaygroundBackend,
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
    name: "postwoman",
    href: "https://postwoman.io",
    label: "http api test",
    category: ToolCategory.Playground,
    elite: true,
    title: "API request builder",
  },
  {
    name: "CodeSandbox",
    href: "https://codesandbox.io",
    label: "javascript css react",
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: "CodePen[animation]",
    href: "https://codepen.io",
    label: "javascript css",
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: "StackEdit[markdown]",
    href: "https://stackedit.io",
    label: "markdown",
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: "Codeply[theme]",
    href: "https://www.codeply.com/",
    label: "responsive layout bootstrap",
    category: ToolCategory.Playground,
    elite: true,
    title: "create beautiful screenshots of your source code.",
  },
  {
    name: "JSON Editor",
    href: "https://jsoneditoronline.org",
    category: ToolCategory.Playground,
    elite: true,
  },
  {
    name: "StackBlitz[ionic]",
    href: "https://stackblitz.com/fork/ionic",
    label: "javascript css",
    category: ToolCategory.Playground,
  },
  {
    name: "Puppeteer Sandbox",
    href: "https://puppeteersandbox.com/",
    label: "http api test",
    category: ToolCategory.Playground,
    title: "API request builder",
  },
  {
    name: "AST explorer[Js Syntax Tree]",
    href: "https://astexplorer.net",
    category: ToolCategory.Playground,
    title:
      "paste your JavaScript code and generate the Abstract Syntax Tree that will help you understand how the JavaScript parser works.",
  },
  {
    name: "HTTPie",
    href: "https://httpie.org/run",
    category: ToolCategory.Playground,
  },

  {
    name: "Typescript",
    href: "https://www.typescriptlang.org/play",
    label: "javascript",
    category: ToolCategory.Playground,
  },
  {
    name: "prettier",
    href: "https://prettier.io/playground/",
    label: "javascript format",
    category: ToolCategory.Playground,
  },
  {
    name: "Babel",
    href: "https://babeljs.io/repl",
    label: "javascript",
    category: ToolCategory.Playground,
  },
  {
    name: "Sass Meister",
    href: "https://www.sassmeister.com",
    label: "css scss",
    category: ToolCategory.Playground,
  },
  {
    name: "Dart",
    href: "https://repl.it/languages/dart",
    label: "javascript",
    category: ToolCategory.Playground,
  },
  {
    name: "Ellie[Elm]",
    href: "https://ellie-app.com/",
    label: "javascript",
    category: ToolCategory.Playground,
  },

  {
    name: "Ideone",
    href: "https://ideone.com/",
    label: "Bash C Perl C# PHP C++ Python C++ Python Haskell Ruby Java SQLite Objective-C Swift",
    category: ToolCategory.PlaygroundBackend,
    elite: true,
  },
  {
    name: ".NET Fiddle",
    href: "https://dotnetfiddle.net",
    label: "c#",
    category: ToolCategory.PlaygroundBackend,
    elite: true,
  },
  {
    name: "Pyfiddle",
    href: "https://pyfiddle.io/",
    label: "python",
    category: ToolCategory.PlaygroundBackend,
    elite: true,
  },
  {
    name: "Rust Playground",
    href: "https://play.integer32.com/",
    category: ToolCategory.PlaygroundBackend,
    elite: true,
  },
  {
    name: "ScalaFiddle",
    href: "https://scalafiddle.io",
    category: ToolCategory.PlaygroundBackend,
    elite: true,
  },
  {
    name: "SQLite browser",
    href: "https://extendsclass.com/sqlite-browser.html",
    category: ToolCategory.PlaygroundBackend,
  },

  {
    name: "Kotlin",
    href: "https://repl.it/languages/kotlin",
    label: "java",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Lua",
    href: "https://repl.it/languages/lua",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Ruby",
    href: "https://repl.it/languages/ruby",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Nodejs",
    href: "https://repl.it/languages/nodejs",
    label: "javascript",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Go",
    href: "https://repl.it/languages/go",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "C++",
    href: "https://repl.it/languages/cpp",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "C",
    href: "https://repl.it/languages/c",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "FSharp",
    href: "https://repl.it/languages/fsharp",
    label: ".net",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Swift",
    href: "https://repl.it/languages/Swift",
    label: "ios apple",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Crystal",
    href: "https://repl.it/languages/crystal",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Elixir",
    href: "https://repl.it/languages/elixir",
    label: "erlang",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "SQLite",
    href: "https://repl.it/languages/sqlite",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Java",
    href: "https://repl.it/languages/java10",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "PHP",
    href: "https://repl.it/languages/php_cli",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Clojure",
    href: "https://repl.it/languages/clojure",
    category: ToolCategory.PlaygroundBackend,
  },
  {
    name: "Perl",
    href: "http://tryperl.pl",
    category: ToolCategory.PlaygroundBackend,
  },

  {
    name: "Mockaroo",
    href: "https://www.mockaroo.com",
    category: ToolCategory.Generator,
    elite: true,
    title: "generate dummy test data in CSV, JSON, SQL and Excel formats.",
  },
  {
    name: "Carbon[code image]",
    href: "https://carbon.now.sh",
    category: ToolCategory.Generator,
    elite: true,
    title: "create and share beautiful images of your source code.",
  },
  {
    name: "CSS3 Generator",
    href: "https://enjoycss.com",
    label: "animation",
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: "NGINX Config",
    href: "https://www.digitalocean.com/community/tools/nginx",
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: "Random Keygen Generator",
    href: "https://randomkeygen.com",
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: "Git Command Explorer",
    href: "https://gitexplorer.com/",
    category: ToolCategory.Generator,
    elite: true,
  },
  {
    name: "Stylelint Generator",
    href: "https://maximgatilin.github.io/stylelint-config",
    label: "css",
    category: ToolCategory.Generator,
  },
  {
    name: "Random Word Generator",
    href: "https://codebeautify.org/random-word-generator",
    category: ToolCategory.Generator,
  },
  {
    name: "NTLM Hash Generator",
    href: "https://codebeautify.org/ntlm-hash-generator",
    category: ToolCategory.Generator,
  },
  {
    name: "Password Generator",
    href: "https://codebeautify.org/password-generator",
    category: ToolCategory.Generator,
  },
  {
    name: "Credit Card Fake Number",
    href: "https://codebeautify.org/credit-card-fake-number-generator",
    category: ToolCategory.Generator,
  },
  {
    name: "Sharelink Generator",
    href: "https://codebeautify.org/share-link-generator",
    category: ToolCategory.Generator,
  },

  {
    name: "Document Converter",
    href: "https://convertio.co/zh/document-converter",
    category: ToolCategory.Converter,
    elite: true,
  },
  {
    name: "Image Converter",
    href: "https://convertio.co/zh/image-converter",
    category: ToolCategory.Converter,
    label: "svg png jpg gif",
    elite: true,
  },
  {
    name: "Data Converter[to php]",
    href: "https://dataconverter.curiousconcept.com",
    category: ToolCategory.Converter,
    title: "json/cvs/xml/yaml/INI to json/xml/yaml/php",
    elite: true,
  },
  {
    name: "Word to HTML",
    href: "https://codebeautify.org/word-to-html-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "Online Tableizer",
    href: "https://codebeautify.org/tableizer",
    category: ToolCategory.Converter,
  },
  {
    name: "HTML to CSV",
    href: "https://codebeautify.org/html-to-csv-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "Image to Base64",
    href: "https://codebeautify.org/image-to-base64-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "Base64 to Image",
    href: "https://codebeautify.org/base64-to-image-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "Date Calculater",
    href: "https://codebeautify.org/date-time-calculater",
    category: ToolCategory.Converter,
  },
  {
    name: "EXCEL to HTML",
    href: "https://codebeautify.org/excel-to-html",
    category: ToolCategory.Converter,
  },
  {
    name: "EXCEL to XML",
    href: "https://codebeautify.org/excel-to-xml",
    category: ToolCategory.Converter,
  },
  {
    name: "EXCEL to JSON",
    href: "https://codebeautify.org/excel-to-json",
    category: ToolCategory.Converter,
  },
  {
    name: "CSV to HTML",
    href: "https://codebeautify.org/csv-to-html-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "JSON to CSV",
    href: "https://codebeautify.org/json-to-csv",
    category: ToolCategory.Converter,
  },
  {
    name: "XML to CSV",
    href: "https://codebeautify.org/xml-to-csv-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "CSV to MULTILINE DATA",
    href: "https://codebeautify.org/csv-to-multi-line-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "CSV to SQL",
    href: "https://codebeautify.org/csv-to-sql-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "SQL to CSV",
    href: "https://codebeautify.org/sql-to-csv-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "SQL to JSON",
    href: "https://codebeautify.org/sql-to-json-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "SQL to XML",
    href: "https://codebeautify.org/sql-to-xml-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "SQL to YAML",
    href: "https://codebeautify.org/sql-to-yaml-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "SQL to HTML",
    href: "https://codebeautify.org/sql-to-html-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "OPML to JSON",
    href: "https://codebeautify.org/opml-to-json-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "JSON to HTML",
    href: "https://codebeautify.org/json-to-html-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "XML to HTML",
    href: "https://codebeautify.org/xml-to-html-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "JSON to Excel",
    href: "https://codebeautify.org/json-to-excel-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "XML to Excel",
    href: "https://codebeautify.org/xml-to-excel-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "CSV to Excel",
    href: "https://codebeautify.org/csv-to-excel-converter",
    category: ToolCategory.Converter,
  },
  {
    name: "YAML to Excel",
    href: "https://codebeautify.org/yaml-to-excel-converter",
    category: ToolCategory.Converter,
  },

  {
    name: "Converting Colors",
    href: "https://convertingcolors.com/",
    category: ToolCategory.UnitConverter,
    label: "hex rgb cmy hsl",
    elite: true,
  },
  {
    name: "All NumbersConverter",
    href: "https://codebeautify.org/all-number-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "NUMBER to WORD",
    href: "https://codebeautify.org/number-to-word-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "String to Hex",
    href: "https://codebeautify.org/string-hex-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Hex to String",
    href: "https://codebeautify.org/hex-string-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "String to Binary",
    href: "https://codebeautify.org/string-binary-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Binary to String",
    href: "https://codebeautify.org/binary-string-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Case Converter",
    href: "https://codebeautify.org/case-converter",
    category: ToolCategory.UnitConverter,
  },

  {
    name: "Length Converter",
    href: "https://codebeautify.org/length-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Weight Converter",
    href: "https://codebeautify.org/weight-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Volume Converter",
    href: "https://codebeautify.org/volume-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Area Converter",
    href: "https://codebeautify.org/area-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Temperature Converter",
    href: "https://codebeautify.org/temperature-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Density Converter",
    href: "https://codebeautify.org/density-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Electric Current Converter",
    href: "https://codebeautify.org/electric-current-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Speed Converter",
    href: "https://codebeautify.org/speed-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Angle Converter",
    href: "https://codebeautify.org/angle-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Bytes/Bits Converter",
    href: "https://codebeautify.org/bytes-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Energy Converter",
    href: "https://codebeautify.org/energy-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Force Converter",
    href: "https://codebeautify.org/force-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Fuel Converter",
    href: "https://codebeautify.org/fuel-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Mass Converter",
    href: "https://codebeautify.org/mass-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Power Converter",
    href: "https://codebeautify.org/power-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Pressure Converter",
    href: "https://codebeautify.org/pressure-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Time Converter",
    href: "https://codebeautify.org/time-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Astronomical Converter",
    href: "https://codebeautify.org/astronomical-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Frequency Converter",
    href: "https://codebeautify.org/frequency-converter",
    category: ToolCategory.UnitConverter,
  },
  {
    name: "Unix Timestamp Converter",
    href: "https://codebeautify.org/unix-time-stamp-converter",
    category: ToolCategory.UnitConverter,
  },

  {
    name: "Javascript Validator",
    href: "https://validatejavascript.com",
    category: ToolCategory.Validator,
    elite: true,
  },
  {
    name: "htaccess tester",
    href: "https://htaccess.madewithlove.be",
    category: ToolCategory.Validator,
    elite: true,
    title: "test htaccess rewrite rules",
  },
  {
    name: "Glob Test",
    href: "https://www.digitalocean.com/community/tools/glob",
    category: ToolCategory.Validator,
    elite: true,
  },
  {
    name: "JSON Validator",
    href: "https://jsonformatter.curiousconcept.com",
    category: ToolCategory.Validator,
    elite: true,
  },
  {
    name: "JSON Path Tester",
    href: "https://jsonpath.curiousconcept.com",
    category: ToolCategory.Validator,
  },
  {
    name: "XPath Tester",
    href: "https://xpath.curiousconcept.com/",
    category: ToolCategory.Validator,
  },
  {
    name: "CSS Validator",
    href: "https://codebeautify.org/cssvalidate",
    category: ToolCategory.Validator,
  },
  {
    name: "XML Validator",
    href: "https://codebeautify.org/xmlvalidator",
    category: ToolCategory.Validator,
  },
  {
    name: "API Test",
    href: "https://codebeautify.org/api-test",
    category: ToolCategory.Validator,
  },
  {
    name: "YAML Validator",
    href: "https://codebeautify.org/yaml-validator",
    category: ToolCategory.Validator,
  },
  {
    name: "Credit Card Validator",
    href: "https://codebeautify.org/credit-card-validate",
    category: ToolCategory.Validator,
  },
  {
    name: "Responsive Website Tester",
    href: "https://codebeautify.org/responsive-website-tester",
    category: ToolCategory.Validator,
  },
  {
    name: "Broken Link Checker",
    href: "https://codebeautify.org/broken-link-checker",
    category: ToolCategory.Validator,
  },

  {
    name: "RegExr",
    href: "https://regexr.com",
    label: "regular",
    category: ToolCategory.String,
    elite: true,
  },
  {
    name: "Regulex",
    href: "https://jex.im/regulex",
    category: ToolCategory.String,
    label: "regular",
  },
  {
    name: "String Builder",
    href: "https://codebeautify.org/string-builder",
    category: ToolCategory.String,
  },
  {
    name: "WORD COUNTER",
    href: "https://codebeautify.org/wordcounter",
    category: ToolCategory.String,
  },
  {
    name: "Reverse String",
    href: "https://codebeautify.org/reverse-string",
    category: ToolCategory.String,
  },
  {
    name: "Delimited Text Extractor ",
    href: "https://codebeautify.org/delimited-text-extractor",
    category: ToolCategory.String,
  },
  {
    name: "Remove Accents ",
    href: "https://codebeautify.org/remove-accents",
    category: ToolCategory.String,
  },
  {
    name: "Remove Duplicate Lines",
    href: "https://codebeautify.org/remove-duplicate-lines",
    category: ToolCategory.String,
  },
  {
    name: "Remove Empty Lines",
    href: "https://codebeautify.org/remove-empty-lines",
    category: ToolCategory.String,
  },
  {
    name: "Remove Extra Spaces ",
    href: "https://codebeautify.org/remove-extra-spaces",
    category: ToolCategory.String,
  },
  {
    name: "Remove Line Breaks",
    href: "https://codebeautify.org/remove-line-breaks",
    category: ToolCategory.String,
  },
  {
    name: "Remove Lines Containing",
    href: "https://codebeautify.org/remove-lines-containing",
    category: ToolCategory.String,
  },
  {
    name: "Sort Text Lines",
    href: "https://codebeautify.org/sort-text-lines",
    category: ToolCategory.String,
  },

  {
    name: "Image Base64",
    href: "https://www.base64-image.de",
    category: ToolCategory.Encode,
    elite: true,
  },
  {
    name: "HTML Encode",
    href: "https://codebeautify.org/html-encode-string",
    category: ToolCategory.Encode,
  },
  {
    name: "HTML Decode",
    href: "https://codebeautify.org/html-decode-string",
    category: ToolCategory.Encode,
  },
  {
    name: "Base64-Encode",
    href: "https://codebeautify.org/base64-encode",
    category: ToolCategory.Encode,
  },
  {
    name: "Base64-Decode",
    href: "https://codebeautify.org/base64-decode",
    category: ToolCategory.Encode,
  },
  {
    name: "URL-Encode",
    href: "https://codebeautify.org/url-encode-string",
    category: ToolCategory.Encode,
  },
  {
    name: "URL-Decode",
    href: "https://codebeautify.org/url-decode-string",
    category: ToolCategory.Encode,
  },

  {
    name: "HTML Escape",
    href: "https://codebeautify.org/html-escape-unescape",
    category: ToolCategory.Encode,
  },
  {
    name: "XML Escape",
    href: "https://codebeautify.org/xml-escape-unescape",
    category: ToolCategory.Encode,
  },
  {
    name: "Javascript Escape",
    href: "https://codebeautify.org/javascript-escape-unescape",
    category: ToolCategory.Encode,
  },
  {
    name: "CSV Escape",
    href: "https://codebeautify.org/csv-escape-unescape",
    category: ToolCategory.Encode,
  },
  {
    name: "SQL Escape",
    href: "https://codebeautify.org/sql-escape-unescape",
    category: ToolCategory.Encode,
  },
  {
    name: "Un-Google Link",
    href: "https://codebeautify.org/un-google-link",
    category: ToolCategory.Encode,
  },
  {
    name: "Encryption-Decryption",
    href: "https://codebeautify.org/encrypt-decrypt",
    category: ToolCategory.Encode,
  },

  {
    name: "File Difference",
    href: "https://codebeautify.org/file-diff",
    category: ToolCategory.Diff,
  },
  {
    name: "JSON Diff",
    href: "https://codebeautify.org/json-diff",
    category: ToolCategory.Diff,
  },
  {
    name: "XML Diff",
    href: "https://codebeautify.org/xml-diff",
    category: ToolCategory.Diff,
  },
  {
    name: "CSV compare",
    href: "https://extendsclass.com/csv-diff.html",
    category: ToolCategory.Diff,
  },
  {
    name: "PDF compare",
    href: "https://extendsclass.com/pdf-diff.html",
    category: ToolCategory.Diff,
  },

  {
    name: "svgomg",
    href: "https://jakearchibald.github.io/svgomg/",
    category: ToolCategory.Minifier,
    elite: true,
    title: "SVG Optimizer",
  },
  {
    name: "image compressor",
    href: "https://imagecompressor.com/",
    category: ToolCategory.Minifier,
    elite: true,
    title: "shrink JPEG and PNG images to the minimum possible size",
  },
  {
    name: "JSCompress",
    href: "https://jscompress.com/",
    category: ToolCategory.Minifier,
    elite: true,
  },
  {
    name: "CSS Minifier",
    href: "https://cssminifier.com/",
    category: ToolCategory.Minifier,
  },
  {
    name: "Json Minifier",
    href: "https://codebeautify.org/jsonminifier",
    category: ToolCategory.Minifier,
  },
  {
    name: "Text Minifier",
    href: "https://codebeautify.org/text-minifier",
    category: ToolCategory.Minifier,
  },

  {
    name: "package.json scan",
    href: "https://bundlephobia.com/scan",
    label: "npm",
    elite: true,
  },
  {
    name: "Lorem-Ipsum",
    href: "https://codebeautify.org/lorem-ipsum",
  },
  {
    name: "IP to Hostname",
    href: "https://codebeautify.org/ip-to-hostname",
  },
  {
    name: "MX Lookup",
    href: "https://codebeautify.org/mx-lookup",
  },
  {
    name: "Nameserver Lookup",
    href: "https://codebeautify.org/name-server-lookup",
  },
  {
    name: "Open Port Checker",
    href: "https://codebeautify.org/open-port-checker",
  },
]

console.log(JSON.stringify(Grids))

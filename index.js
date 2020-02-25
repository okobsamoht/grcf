#!/usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs-extra");

var componentName;

var program = require("commander")
    .version(require("./package.json").version)
    .arguments("<component-directory>")
    .action(function(name) {
        componentName = name;
    })
    .parse(process.argv);

createComponent(componentName);

function createComponent(name) {
    var root = path.resolve(name);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    var cssLine = "";
    fs.writeFileSync(
        path.join(root, `${name}.css`),
        `.${name} {display:block}\n #${name} {display:block}`
    );
    cssLine = `import s from './${name}.css'`;

    fs.writeFileSync(
        path.join(root, `${name}.js`),
        `import React from 'react';
        import './${name}.css';\n
        function ${name}() {
        \treturn (
        \t\t<div className="${name}" id="${name}">
        \t\t\t ${name}
        \t\t</div>
        \t);
        };\n
        export default ${name};\n
        `
    );
    fs.writeFileSync(
        path.join(root, `${name}.test.js`),
        `import React from 'react';
        import { render } from '@testing-library/react';\n
        import ${name} from './${name}';\n
        test('renders learn react link', () => {\n
        \tconst { getByText } = render(<${name} />);\n
        \tconst linkElement = getByText(/${name}/i);\n
        \texpect(linkElement).toBeInTheDocument();\n
        });\n`
    );
    console.log(`Component ${name} created`);
}
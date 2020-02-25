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
    .option("-p, --pure", "Create Pure Function Component")
    .option("-c, --css", `Add ${componentName}.css`)
    .option("-t, --test", `Add ${componentName}.test.js`)
    .parse(process.argv);

createComponent(componentName);

function createComponent(name) {
    var root = path.resolve(name);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    var cssLine = "";
    if (program.css) {
        fs.writeFileSync(path.join(root, `${name}.css`));
        cssLine = `import s from './${name}.css'\n\n`;
    }

    if (program.pure) {
        fs.writeFileSync(
            path.join(root, `${name}.js`),
            `import React from 'react'\n` +
            cssLine +
            `const ${name} = (props) => {\n` +
            `\treturn (\n` +
            `\t\t<div>\n\t\t</div>\n` +
            `\t)\n` +
            `}\n\n` +
            `export default ${name}`
        );
    } else {
        fs.writeFileSync(
            path.join(root, `${name}.js`),
            `import React, { Component } from 'react'\n` +
            cssLine +
            `class ${name} extends Component {\n\n` +
            `\tcomponentDidMount() {\n` +
            `\t}\n\n` +
            `\trender() {\n` +
            `\t\treturn (\n` +
            `\t\t)\n\n` +
            `\t}\n\n` +
            `}\n\n` +
            `export default ${name}`
        );
    }
    fs.writeFileSync(
        path.join(root, `${name}.test.js`),
        `import React from 'react'\n` +
        `import { render } from '@testing-library/react'\n` +
        `import ${name} from './${name}'\n` +
        `describe('<${name} />', () => {\n` +
        `\ttest('renders', () => {\n` +
        `\tconst wrapper = shallow( < ${name} / > );\n` +
        `\texpect(wrapper).toMatchSnapshot();\n` +
        `\t});\n` +
        `});\n`
    );
    console.log(`Component ${name} created`);
}
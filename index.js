#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs-extra");

let componentName;
let componentType;
let componentStyle;

const program = require("commander")
    .version(require("./package.json").version)
    .arguments("<component-directory>")
    .option('-js', 'component javascript type')
    .option('-tsx', 'component typescript type')
    .option('-css', 'component style css type')
    .option('-scss', 'component style scss type')
    .action(function (name, options) {
        componentName = name;
        componentType = options.Js ? 'js' : options.Tsx ? 'tsx' : 'js';
        componentStyle = options.Css ? 'css' : options.Scss ? 'scss' : 'css';
    })
    .parse(process.argv);

console.log('GRCF ' + program.version())

createComponent(componentName, componentType, componentStyle);

function createComponent(name, type, style) {
    let root = path.resolve(name);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    fs.writeFileSync(
        path.join(root, `${name}.${style}`),
        `.${name} {display:block}`
    );

    fs.writeFileSync(
        path.join(root, `${name}.${type}`),
        `import React from 'react';
import './${name}.${style}';\n
const ${name} = (props) => {
\treturn (
\t\t<div className="${name}">
\t\t\t ${name}
\t\t</div>
\t);
};\n
export default ${name};`
    );
    fs.writeFileSync(
        path.join(root, `index.${type}`),
        `export {default} from './${name}';`
    );
    fs.writeFileSync(
        path.join(root, `${name}.test.${type}`),
        `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${name} from './${name}';\n
test('verify component', () => {
\trender(<${name} />);
\tconst linkElement = screen.getByText(/${name}/i);
\texpect(linkElement).toBeInTheDocument();
});\n`
    );
    console.log(`Component ${name} created with type ${type} and ${style} style file`);
}

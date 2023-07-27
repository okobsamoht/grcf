#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs-extra");

let componentName;
let componentType;
let componentStyle;
let componentMode;
let componentTest;

const program = require("commander")
    .version(require("./package.json").version)
    .arguments("<component-directory>")
    .option('-jsx', 'component jsx type')
    .option('-tsx', 'component typescript type')
    .option('-css', 'component style css type')
    .option('-scss', 'component style scss type')
    .option('-file', 'component single file mode')
    .option('-nostyle', 'component no style file')
    .option('-notest', 'component no test file')
    .action(function (name, options) {
        componentName = name;
        componentType = options.Jsx ? 'jsx' : options.Tsx ? 'tsx' : 'js';
        componentStyle = options.Nostyle ? 'nostyle' : options.Scss ? 'scss' : 'css';
        componentMode = options.File ? 'file' : 'folder';
        componentTest = options.Notest ? 'notest' : 'test';
    })
    .parse(process.argv);

console.log('GRCF ' + program.version())

function createComponentFolder(name, type, style, mode, test) {
    let root;

    if (mode === 'folder'){
        root = path.resolve(name);
    } else if (mode === 'file'){
        root = path.resolve('.');
    }

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    if (style !== 'nostyle'){
        fs.writeFileSync(
            path.join(root, `${name}.${style}`),
            `.${name} {}`);
    }

    fs.writeFileSync(
        path.join(root, `${name}.${type}`),
        `import React from "react";\n`
            .concat(style !== 'nostyle' ? `import "./${name}.${style}";\n` :``)
            .concat(`const ${name} = (props${type==='tsx' ? ':any':''}) => {\n\treturn (\n\t\t<div className=\{"${name}"\}>\n\t\t\t ${name}\n\t\t</div>\n\t);\n};\n`)
            .concat(`export default ${name};`)
    );

    if (mode === 'folder'){
        fs.writeFileSync(
            path.join(root, `index.${type}`),
            `export {default} from './${name}';`);
    }

    if (test==='test'){
        fs.writeFileSync(
            path.join(root, `${name}.test.${type}`),
            `import React from 'react';\n`
                .concat(`import { render, screen } from '@testing-library/react';\n`)
                .concat(`import ${name} from './${name}';\n`)
                .concat(`test('verify component', () => {\n\trender(<${name} />);\n\tconst linkElement = screen.getByText(/${name}/i);\n\texpect(linkElement).toBeInTheDocument();\n});\n`)
        );
    }
    console.log(`Component ${name} created.`);
}


createComponentFolder(componentName, componentType, componentStyle, componentMode, componentTest);

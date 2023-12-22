#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs-extra");

let componentName;
let componentType;
let componentStyle;
let componentMode;
let componentTest;
let componentNative;

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
    .option('-native', 'component react-native type')
    .action(function (name, options) {
        componentName = name;
        componentType = options.Jsx ? 'jsx' : options.Tsx ? 'tsx' : 'js';
        componentStyle = options.Nostyle ? 'nostyle' : options.Scss ? 'scss' : 'css';
        componentMode = options.File ? 'file' : 'folder';
        componentTest = options.Notest ? 'notest' : 'test';
        componentNative = options.Native ? 'native' : 'web';
    })
    .parse(process.argv);

console.log('GRCF ' + program.version())

function createComponentFolder(name, type, style, mode, test, native) {
    let root;

    if (mode === 'folder'){
        root = path.resolve(name);
    } else if (mode === 'file'){
        root = path.resolve('.');
    }

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    if (style !== 'nostyle' && native === 'web'){
        fs.writeFileSync(
            path.join(root, `${name}.${style}`),
            `.${name} {}`);
    }

    if (style !== 'nostyle' && native === 'native'){
        fs.writeFileSync(
            path.join(root, `${name}.style.${type}`),
            `import { StyleSheet } from 'react-native';\nconst ${name}Style = StyleSheet.create({\n\tview:{\n\t\tflex:1\n\t}\n});\nexport default ${name}Style;`);
    }

    if (native === "web"){
        fs.writeFileSync(
            path.join(root, `${name}.${type}`),
            `import React from "react";\n`
                .concat(style !== 'nostyle' ? `import "./${name}.${style}";\n` :``)
                .concat(`const ${name} = (props${type==='tsx' ? ':any':''}) => {\n\treturn (\n\t\t<div className=\{"${name}"\}>\n\t\t\t ${name}\n\t\t</div>\n\t);\n};\n`)
                .concat(`export default ${name};`)
        );
    }
    if (native === "native"){
        fs.writeFileSync(
            path.join(root, `${name}.${type}`),
            `import {View} from "react-native";\n`
                .concat((style !== 'nostyle' && native === 'native') ? `import ${name}Style from "./${name}.style.${type}";\n` :``)
                .concat(`const ${name} = (props) => {\n\treturn (\n\t\t<View style=\{${name}Style\}>\n\t\t\t ${name}\n\t\t</View>\n\t);\n};\n`)
                .concat(`export default ${name};`)
        );
    }

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


createComponentFolder(componentName, componentType, componentStyle, componentMode, componentTest, componentNative);

#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs-extra");

let componentName;

const program = require("commander")
    .version(require("./package.json").version)
    .arguments("<component-directory>")
    .action(function (name) {
        componentName = name;
    })
    .parse(process.argv);

createComponent(componentName);

function createComponent(name) {
    let root = path.resolve(name);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    fs.writeFileSync(
        path.join(root, `${name}.css`),
        `.${name} {display:block}`
    );

    fs.writeFileSync(
        path.join(root, `${name}.js`),
`import React from 'react';
import './${name}.css';\n
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
        path.join(root, `index.js`),
        `export {default} from './${name}';`
    );
    fs.writeFileSync(
        path.join(root, `${name}.test.js`),
`import React from 'react';
import { render } from '@testing-library/react';
import ${name} from './${name}';\n
test('verify component', () => {
\tconst { getByText } = render(<${name} />);
\tconst linkElement = getByText(/${name}/i);
\texpect(linkElement).toBeInTheDocument();
});\n`
    );
    console.log(`Component ${name} created`);
}

import * as core from '@actions/core';
import { promises as fs } from 'fs';
import ow from 'ow';

import CheckovConverter from './checkov/checkov-converter';

const SupportedTypes = ['checkov'];

function getConverter(type: string) {
    if (type === 'checkov') {
        return new CheckovConverter();
    }

    throw new Error('Unknown type');
}

async function run(): Promise<void> {
    const type = core.getInput('type');
    const input = core.getInput('input');
    const output = core.getInput('output');

    ow(type, ow.string.oneOf(SupportedTypes));
    ow(input, ow.string.maxLength(100));
    ow(output, ow.string.maxLength(100));

    const converter = getConverter(type);
    const data = await fs.readFile(input);
    const sarif = converter.convert(data);

    await fs.writeFile(output, JSON.stringify(sarif, null, 4));
}

(async function () {
    await run();
})();

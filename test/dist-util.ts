import { suite , test } from 'mocha-typescript';
import * as main from '../lib/dist-util';
import * as assert from 'assert';

describe('DistReplaceTest', function () {
    let testCases = [
        {
            input: './dist/lib/dist-util',
            expected: './lib/dist-util'
        },
        {
            input: './dist/bin/dist-util.js',
            expected: './bin/dist-util.js'
        }
    ]
    testCases.forEach((testCase) => {
        it(`can replace ${testCase.input} => ${testCase.expected}`, function () {
            assert.equal(main.stripDistFolder(testCase.input, 'dist'), testCase.expected)
        })
    })
})


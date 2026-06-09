const test = require('node:test')
const assert = require('node:assert/strict')

const { normalizeBlueprintVariablesForClient, normalizeBlueprintVariablesForStorage } = require('../lib/exerciseBlueprintUtils')

test('preserves calculation variable definitions for storage and client responses', () => {
    const incoming = {
        A: { min: 2, max: 8, type: 'int' },
        f: { min: 1, max: 5, type: 'float', decimals: 2 }
    }

    const stored = normalizeBlueprintVariablesForStorage(incoming)
    assert.deepEqual(stored, incoming)

    const client = normalizeBlueprintVariablesForClient(stored)
    assert.deepEqual(client, incoming)
})

test('keeps theoretical options as arrays', () => {
    const incoming = {
        blank1: [
            { name: 'A', value: '1' },
            { name: 'B', value: '2' }
        ]
    }

    const stored = normalizeBlueprintVariablesForStorage(incoming)
    assert.deepEqual(stored, incoming)

    const client = normalizeBlueprintVariablesForClient(stored)
    assert.deepEqual(client, incoming)
})

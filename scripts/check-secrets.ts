// Run: node --experimental-strip-types scripts/check-secrets.ts
import assert from 'node:assert/strict'
import { matchSecret } from '../composables/useTheme.ts'
assert.equal(matchSecret('xxpikachu'), 'kanto')
assert.equal(matchSecret('UUDDLRLRba'), 'gameboy')
assert.equal(matchSecret('zUUDDLRLRba'), 'gameboy')
assert.equal(matchSecret('neo'), 'matrix')
assert.equal(matchSecret('kamehameha'), 'saiyan')
assert.equal(matchSecret('UUDDLRLRb'), null)
assert.equal(matchSecret('zelda'), 'hyrule')
assert.equal(matchSecret('xforce'), 'jedi')
assert.equal(matchSecret('fuerza'), 'jedi')
assert.equal(matchSecret('força'), 'jedi')
assert.equal(matchSecret('macht'), 'jedi')
assert.equal(matchSecret('lumos'), 'lumos')
assert.equal(matchSecret('lum'), null)
assert.equal(matchSecret(''), null)
console.log('ok')

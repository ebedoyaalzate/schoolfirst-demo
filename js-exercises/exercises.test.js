// Tests con el runner nativo de Node (sin dependencias). Correr: npm run test:js
const test = require('node:test');
const assert = require('node:assert/strict');
const { isPalindrome, isPalindromeTwoPointers, isPalindromeEvery } = require('./palindrome');
const p = require('./practice');

const cases = [
  ['Bob', true],
  ['noon', true],
  ['hello', false],
  ['Anita lava la tina', true],
  ['', true],
  ['a', true],
];

for (const fn of [isPalindrome, isPalindromeTwoPointers, isPalindromeEvery]) {
  test(`${fn.name} resuelve todos los casos`, () => {
    for (const [input, expected] of cases) assert.equal(fn(input), expected, input);
  });
}

test('strings', () => {
  assert.equal(p.reverseWords('hola mundo'), 'aloh odnum');
  assert.equal(p.capitalize('ana PÉREZ'), 'Ana Pérez');
  assert.deepEqual(p.charCount('aab'), { a: 2, b: 1 });
  assert.equal(p.isAnagram('listen', 'silent'), true);
  assert.equal(p.firstUnique('aabcc'), 'b');
});

test('arrays', () => {
  assert.deepEqual(p.unique([1, 2, 2, 3]), [1, 2, 3]);
  assert.deepEqual(p.groupBy([{ g: 9 }, { g: 10 }, { g: 9 }], s => s.g), { 9: [{ g: 9 }, { g: 9 }], 10: [{ g: 10 }] });
  assert.deepEqual(p.twoSum([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(p.fizzBuzz(5), ['1', '2', 'Fizz', '4', 'Buzz']);
  assert.deepEqual(p.flatten([1, [2, [3]]]), [1, 2, 3]);
  assert.equal(p.max([3, 9, 2]), 9);
  assert.equal(p.max([]), undefined);
});

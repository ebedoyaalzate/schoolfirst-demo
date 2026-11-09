import {
  capitalize,
  charCount,
  firstUnique,
  fizzBuzz,
  flatten,
  groupBy,
  isAnagram,
  isPalindrome,
  isPalindromeEvery,
  isPalindromeTwoPointers,
  max,
  reverseWords,
  twoSum,
  unique,
} from './palindrome.util';

describe('palindrome', () => {
  const cases: [string, boolean][] = [
    ['Bob', true],
    ['noon', true],
    ['hello', false],
    ['Anita lava la tina', true],
    ['', true],
    ['a', true],
  ];

  for (const fn of [isPalindrome, isPalindromeTwoPointers, isPalindromeEvery]) {
    it(`${fn.name} resuelve todos los casos`, () => {
      for (const [input, expected] of cases) expect(fn(input)).withContext(input).toBe(expected);
    });
  }
});

describe('repaso strings/arrays', () => {
  it('strings', () => {
    expect(reverseWords('hola mundo')).toBe('aloh odnum');
    expect(capitalize('ana PÉREZ')).toBe('Ana Pérez');
    expect(charCount('aab')).toEqual({ a: 2, b: 1 });
    expect(isAnagram('listen', 'silent')).toBeTrue();
    expect(firstUnique('aabcc')).toBe('b');
  });

  it('arrays', () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    expect(groupBy([{ g: 9 }, { g: 10 }, { g: 9 }], s => s.g)).toEqual({ 9: [{ g: 9 }, { g: 9 }], 10: [{ g: 10 }] });
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(fizzBuzz(5)).toEqual(['1', '2', 'Fizz', '4', 'Buzz']);
    expect(flatten([1, [2, [3]]])).toEqual([1, 2, 3]);
    expect(max([3, 9, 2])).toBe(9);
    expect(max([])).toBeUndefined();
  });
});

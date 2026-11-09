// Repaso: array methods, manipulación de strings y problem-solving (JavaScript puro).
// Correr: node js-exercises/practice.js

const { normalize } = require('./palindrome');

/** Invertir cada palabra manteniendo el orden: "hola mundo" → "aloh odnum". */
const reverseWords = s =>
  s.split(' ').map(w => [...w].reverse().join('')).join(' ');

/** Capitalizar: "ana pérez" → "Ana Pérez". */
const capitalize = s =>
  s.split(' ').map(w => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)).join(' ');

/** Contar ocurrencias de cada carácter con reduce: "aab" → { a: 2, b: 1 }. */
const charCount = s =>
  [...s].reduce((acc, c) => ({ ...acc, [c]: (acc[c] ?? 0) + 1 }), {});

/** Anagramas: "listen" / "silent" → true. */
const isAnagram = (a, b) =>
  [...normalize(a)].sort().join('') === [...normalize(b)].sort().join('');

/** Primer carácter que no se repite: "aabcc" → "b". */
const firstUnique = s => {
  const counts = charCount(s);
  return [...s].find(c => counts[c] === 1) ?? null;
};

/** Quitar duplicados con Set: [1, 2, 2, 3] → [1, 2, 3]. */
const unique = arr => [...new Set(arr)];

/** Agrupar por clave: groupBy(estudiantes, e => e.grade). */
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    (acc[key(item)] ??= []).push(item);
    return acc;
  }, {});

/** Two sum: índices de dos números que suman target. Map → O(n). [2, 7, 11, 15], 9 → [0, 1]. */
const twoSum = (nums, target) => {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return null;
};

/** FizzBuzz clásico del 1 a n. */
const fizzBuzz = n =>
  Array.from({ length: n }, (_, i) => {
    const x = i + 1;
    return x % 15 === 0 ? 'FizzBuzz' : x % 3 === 0 ? 'Fizz' : x % 5 === 0 ? 'Buzz' : String(x);
  });

/** Aplanar un array anidado: [1, [2, [3]]] → [1, 2, 3]. */
const flatten = arr => arr.flat(Infinity);

/** Máximo sin Math.max: con reduce. */
const max = nums => (nums.length ? nums.reduce((a, b) => (b > a ? b : a)) : undefined);

module.exports = {
  reverseWords, capitalize, charCount, isAnagram, firstUnique,
  unique, groupBy, twoSum, fizzBuzz, flatten, max,
};

if (require.main === module) {
  console.log(reverseWords('hola mundo'));
  console.log(capitalize('ana PÉREZ'));
  console.log(charCount('aab'));
  console.log(isAnagram('listen', 'silent'));
  console.log(firstUnique('aabcc'));
  console.log(unique([1, 2, 2, 3]));
  console.log(groupBy([{ name: 'Ana', grade: 9 }, { name: 'Luis', grade: 10 }], s => s.grade));
  console.log(twoSum([2, 7, 11, 15], 9));
  console.log(fizzBuzz(15).join(' '));
  console.log(flatten([1, [2, [3]]]));
  console.log(max([3, 9, 2]));
}

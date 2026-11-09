/**
 * Ejercicio: ¿la palabra se lee igual al derecho y al revés?
 * Normaliza: minúsculas, sin tildes, sin espacios ni signos ("Bob" → true, "Anita lava la tina" → true).
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .replace(/[^a-z0-9]/g, ''); // quita espacios y signos
}

/** Versión 1: la más legible — invertir el string y comparar. O(n) tiempo, O(n) memoria. */
export function isPalindrome(text: string): boolean {
  const clean = normalize(text);
  return clean === clean.split('').reverse().join('');
}

/** Versión 2: dos punteros — no crea un string invertido. O(n) tiempo, O(1) memoria extra. */
export function isPalindromeTwoPointers(text: string): boolean {
  const clean = normalize(text);
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

/** Versión 3: con array methods — every compara cada char con su espejo (solo la mitad). */
export function isPalindromeEvery(text: string): boolean {
  const chars = [...normalize(text)];
  return chars.slice(0, Math.floor(chars.length / 2)).every((c, i) => c === chars[chars.length - 1 - i]);
}

/* ---------- Repaso: strings, arrays y problem-solving ---------- */

/** Invertir cada palabra manteniendo el orden: "hola mundo" → "aloh odnum". */
export const reverseWords = (s: string): string =>
  s.split(' ').map(w => [...w].reverse().join('')).join(' ');

/** Capitalizar: "ana pérez" → "Ana Pérez". */
export const capitalize = (s: string): string =>
  s.split(' ').map(w => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)).join(' ');

/** Contar ocurrencias de cada carácter con reduce: "aab" → { a: 2, b: 1 }. */
export const charCount = (s: string): Record<string, number> =>
  [...s].reduce<Record<string, number>>((acc, c) => ({ ...acc, [c]: (acc[c] ?? 0) + 1 }), {});

/** Anagramas: "listen" / "silent" → true. */
export const isAnagram = (a: string, b: string): boolean =>
  [...normalize(a)].sort().join('') === [...normalize(b)].sort().join('');

/** Primer carácter que no se repite: "aabcc" → "b". */
export const firstUnique = (s: string): string | null => {
  const counts = charCount(s);
  return [...s].find(c => counts[c] === 1) ?? null;
};

/** Quitar duplicados con Set: [1, 2, 2, 3] → [1, 2, 3]. */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

/** Agrupar por clave: groupBy(estudiantes, e => e.grade). */
export const groupBy = <T, K extends PropertyKey>(arr: T[], key: (item: T) => K): Record<K, T[]> =>
  arr.reduce(
    (acc, item) => {
      (acc[key(item)] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );

/** Two sum: índices de dos números que suman target. Map → O(n). [2, 7, 11, 15], 9 → [0, 1]. */
export const twoSum = (nums: number[], target: number): [number, number] | null => {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return null;
};

/** FizzBuzz clásico del 1 a n. */
export const fizzBuzz = (n: number): string[] =>
  Array.from({ length: n }, (_, i) => {
    const x = i + 1;
    return x % 15 === 0 ? 'FizzBuzz' : x % 3 === 0 ? 'Fizz' : x % 5 === 0 ? 'Buzz' : String(x);
  });

/** Aplanar un array anidado: [1, [2, [3]]] → [1, 2, 3]. */
export const flatten = (arr: unknown[]): unknown[] => arr.flat(Infinity);

/** Máximo sin Math.max: con reduce. */
export const max = (nums: number[]): number | undefined =>
  nums.length ? nums.reduce((a, b) => (b > a ? b : a)) : undefined;

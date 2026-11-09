// Ejercicio: Palindrome checker (JavaScript puro, sin Angular).
// Correr: node js-exercises/palindrome.js

/**
 * Normaliza el texto: minúsculas, sin tildes, sin espacios ni signos.
 * "Anita lava la tina" → "anitalavalatina"
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .replace(/[^a-z0-9]/g, ''); // quita espacios y signos
}

/** Versión 1: la más legible — invertir y comparar. O(n) tiempo, O(n) memoria. */
function isPalindrome(word) {
  const clean = normalize(word);
  return clean === clean.split('').reverse().join('');
}

/** Versión 2: dos punteros — sin crear un string invertido. O(n) tiempo, O(1) memoria extra. */
function isPalindromeTwoPointers(word) {
  const clean = normalize(word);
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
function isPalindromeEvery(word) {
  const chars = [...normalize(word)];
  return chars
    .slice(0, Math.floor(chars.length / 2))
    .every((c, i) => c === chars[chars.length - 1 - i]);
}

module.exports = { normalize, isPalindrome, isPalindromeTwoPointers, isPalindromeEvery };

// Ejemplos al correr el archivo directamente
if (require.main === module) {
  for (const word of ['Bob', 'noon', 'hello', 'Anita lava la tina']) {
    console.log(`${word} → ${isPalindrome(word) ? 'True' : 'False'}`);
  }
}

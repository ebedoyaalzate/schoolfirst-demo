import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { isPalindrome } from './palindrome.util';

/** Ejercicio: verificador de palíndromos. La lógica vive en palindrome.util.ts (función pura, fácil de testear). */
@Component({
  selector: 'app-palindrome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="exercise">
      <h2>Palindrome checker</h2>
      <label for="word">Palabra</label>
      <input id="word" data-cy="word" [value]="word()" (input)="word.set($any($event.target).value)" />
      @if (word()) {
        <p data-cy="palindrome-result" [class.yes]="result()" [class.no]="!result()">
          "{{ word() }}" → {{ result() ? 'True' : 'False' }}
        </p>
      }
      <ul>
        @for (example of examples; track example) {
          <li>
            <button type="button" (click)="word.set(example)">{{ example }}</button>
            → {{ check(example) ? 'True' : 'False' }}
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .yes { color: #067647; font-weight: 600; }
    .no { color: #b42318; font-weight: 600; }
    ul { padding-left: 1rem; }
  `,
})
export class Palindrome {
  protected word = signal('');
  protected result = computed(() => isPalindrome(this.word()));
  protected readonly examples = ['Bob', 'noon', 'hello', 'Anita lava la tina'];
  protected check = isPalindrome;
}

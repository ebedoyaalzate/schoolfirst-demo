import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Palindrome } from './palindrome/palindrome';
import { StatusForm } from './status-form/status-form';

/** Página pública (/exercises) que agrupa los ejercicios aislados. */
@Component({
  selector: 'app-exercises-page',
  imports: [StatusForm, Palindrome],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="exercises">
      <h1>Ejercicios</h1>
      <app-status-form />
      <app-palindrome />
    </main>
  `,
  styles: `
    .exercises { max-width: 640px; margin: 2rem auto; padding: 0 1rem; display: grid; gap: 2rem; }
  `,
})
export class ExercisesPage {}

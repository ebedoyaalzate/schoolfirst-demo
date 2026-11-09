import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatusForm } from './status-form/status-form';

/** Página pública (/exercises) para el ejercicio de formulario reactivo. Los de JS puro están en /js-exercises. */
@Component({
  selector: 'app-exercises-page',
  imports: [StatusForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="exercises">
      <h1>Ejercicios</h1>
      <app-status-form />
    </main>
  `,
  styles: `
    .exercises { max-width: 640px; margin: 2rem auto; padding: 0 1rem; display: grid; gap: 2rem; }
  `,
})
export class ExercisesPage {}

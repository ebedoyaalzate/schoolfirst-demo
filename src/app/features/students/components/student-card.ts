import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Student } from '../student.model';

/** Componente presentacional: solo recibe datos (input) y emite eventos (output). */
@Component({
  selector: 'app-student-card',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" [class.selected]="selected()">
      <button type="button" class="main" (click)="select.emit(student().id)">
        <span class="name">{{ student().name }}</span>
        <span class="meta">Grado {{ student().grade }} · Promedio {{ student().average | number: '1.1-1' }}</span>
      </button>
      <button
        type="button"
        class="fav"
        [attr.aria-pressed]="favorite()"
        [attr.aria-label]="(favorite() ? 'Quitar de favoritos a ' : 'Marcar como favorito a ') + student().name"
        (click)="toggleFavorite.emit(student().id)"
      >
        {{ favorite() ? '★' : '☆' }}
      </button>
    </article>
  `,
  styles: `
    .card { display: flex; align-items: center; gap: .5rem; border: 1px solid #d0d5dd; border-radius: 8px; padding: .25rem; }
    .card.selected { border-color: #2563eb; background: #eff6ff; }
    .main { flex: 1; display: grid; text-align: left; background: none; border: 0; padding: .5rem; cursor: pointer; }
    .name { font-weight: 600; }
    .meta { color: #475467; font-size: .875rem; }
    .fav { font-size: 1.25rem; background: none; border: 0; cursor: pointer; min-width: 44px; min-height: 44px; }
    button:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
  `,
})
export class StudentCard {
  student = input.required<Student>();
  selected = input(false);
  favorite = input(false);

  select = output<number>();
  toggleFavorite = output<number>();
}

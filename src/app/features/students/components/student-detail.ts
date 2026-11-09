import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Student } from '../student.model';

/** Se carga en un chunk aparte gracias a @defer en la página. */
@Component({
  selector: 'app-student-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="detail" aria-labelledby="detail-title">
      <h2 id="detail-title">{{ student().name }}</h2>
      <dl>
        <dt>Email</dt><dd>{{ student().email }}</dd>
        <dt>Grado</dt><dd>{{ student().grade }}</dd>
        <dt>Promedio</dt><dd>{{ student().average }}</dd>
      </dl>
      <button type="button" (click)="close.emit()">Cerrar</button>
    </section>
  `,
  styles: `
    .detail { border: 1px solid #d0d5dd; border-radius: 8px; padding: 1rem; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: .25rem 1rem; }
    dt { color: #475467; }
  `,
})
export class StudentDetail {
  student = input.required<Student>();
  close = output<void>();
}

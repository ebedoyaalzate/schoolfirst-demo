import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/auth/auth.service';
import { StudentCard } from './components/student-card';
import { StudentDetail } from './components/student-detail';
import { StudentsPageActions } from './state/students.actions';
import { studentsFeature } from './state/students.reducer';
import { FavoritesStore } from './state/favorites.store';

/** Componente "smart": conecta el store con los componentes presentacionales. */
@Component({
  selector: 'app-students-page',
  imports: [ReactiveFormsModule, StudentCard, StudentDetail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './students-page.html',
  styleUrl: './students-page.scss',
})
export class StudentsPage implements OnInit {
  private store = inject(Store);
  protected auth = inject(AuthService);
  protected favorites = inject(FavoritesStore);

  // selectSignal: lee del store como signal, sin subscribe ni pipe async.
  protected students = this.store.selectSignal(studentsFeature.selectStudents);
  protected loading = this.store.selectSignal(studentsFeature.selectLoading);
  protected error = this.store.selectSignal(studentsFeature.selectError);
  protected selected = this.store.selectSignal(studentsFeature.selectSelectedStudent);
  protected classAverage = this.store.selectSignal(studentsFeature.selectClassAverage);

  protected search = new FormControl('', { nonNullable: true });

  constructor() {
    // takeUntilDestroyed: se desuscribe solo al destruir el componente (sin fugas de memoria).
    this.search.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(query => this.store.dispatch(StudentsPageActions.searchChanged({ query })));
  }

  ngOnInit(): void {
    this.store.dispatch(StudentsPageActions.searchChanged({ query: '' }));
  }

  protected onSelect(id: number): void {
    this.store.dispatch(StudentsPageActions.studentSelected({ id }));
  }

  protected onClose(): void {
    this.store.dispatch(StudentsPageActions.selectionCleared());
  }
}

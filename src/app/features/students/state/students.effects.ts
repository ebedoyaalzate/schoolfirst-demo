import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { StudentsService } from '../students.service';
import { StudentsApiActions, StudentsPageActions } from './students.actions';

/**
 * Effect funcional: escucha la acción, llama a la API y despacha éxito o error.
 * - debounceTime: espera a que el usuario deje de escribir.
 * - distinctUntilChanged: no repite la misma búsqueda.
 * - switchMap: cancela la petición anterior si llega una búsqueda nueva (evita race conditions).
 * - catchError DENTRO del switchMap: si falla una petición, el effect sigue vivo.
 */
export const searchStudents = createEffect(
  (actions$ = inject(Actions), api = inject(StudentsService)) =>
    actions$.pipe(
      ofType(StudentsPageActions.searchChanged),
      debounceTime(300),
      map(({ query }) => query.trim()),
      distinctUntilChanged(),
      switchMap(query =>
        api.search(query).pipe(
          map(students => StudentsApiActions.loadSuccess({ students })),
          catchError(() => of(StudentsApiActions.loadFailure({ error: 'No se pudo cargar la lista' }))),
        ),
      ),
    ),
  { functional: true },
);

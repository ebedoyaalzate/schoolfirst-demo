import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Student } from '../student.model';
import { StudentsApiActions, StudentsPageActions } from './students.actions';

export interface StudentsState {
  students: Student[];
  query: string;
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialState: StudentsState = {
  students: [],
  query: '',
  selectedId: null,
  loading: false,
  error: null,
};

/** createFeature genera el reducer y un selector por cada propiedad del estado. */
export const studentsFeature = createFeature({
  name: 'students',
  reducer: createReducer(
    initialState,
    // Siempre inmutable: se devuelve un objeto nuevo, nunca se muta el estado.
    on(StudentsPageActions.searchChanged, (state, { query }) => ({
      ...state,
      query,
      loading: true,
      error: null,
    })),
    on(StudentsApiActions.loadSuccess, (state, { students }) => ({
      ...state,
      students,
      loading: false,
    })),
    on(StudentsApiActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(StudentsPageActions.studentSelected, (state, { id }) => ({ ...state, selectedId: id })),
    on(StudentsPageActions.selectionCleared, state => ({ ...state, selectedId: null })),
  ),
  // Selectores derivados: memoizados, solo se recalculan si cambian sus entradas.
  extraSelectors: ({ selectStudents, selectSelectedId }) => ({
    selectSelectedStudent: createSelector(
      selectStudents,
      selectSelectedId,
      (students, id) => students.find(s => s.id === id) ?? null,
    ),
    selectClassAverage: createSelector(selectStudents, students =>
      students.length
        ? Math.round((students.reduce((sum, s) => sum + s.average, 0) / students.length) * 10) / 10
        : 0,
    ),
  }),
});

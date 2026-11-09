import { StudentsApiActions, StudentsPageActions } from './students.actions';
import { initialState, studentsFeature } from './students.reducer';
import { Student } from '../student.model';

const students: Student[] = [
  { id: 1, name: 'Ana', grade: 9, email: 'a@s.com', average: 4 },
  { id: 2, name: 'Bruno', grade: 10, email: 'b@s.com', average: 3 },
];

describe('students reducer', () => {
  const { reducer } = studentsFeature;

  it('marca loading al cambiar la búsqueda', () => {
    const state = reducer(initialState, StudentsPageActions.searchChanged({ query: 'an' }));
    expect(state.loading).toBeTrue();
    expect(state.query).toBe('an');
  });

  it('guarda los estudiantes y no muta el estado anterior', () => {
    const before = { ...initialState, loading: true };
    const after = reducer(before, StudentsApiActions.loadSuccess({ students }));
    expect(after.students).toEqual(students);
    expect(after.loading).toBeFalse();
    expect(before.students).toEqual([]); // inmutabilidad
  });
});

describe('students selectors', () => {
  const state = { ...initialState, students, selectedId: 2 };

  it('devuelve el estudiante seleccionado', () => {
    expect(studentsFeature.selectSelectedStudent.projector(students, 2)?.name).toBe('Bruno');
  });

  it('calcula el promedio del grupo', () => {
    expect(studentsFeature.selectClassAverage.projector(state.students)).toBe(3.5);
  });
});

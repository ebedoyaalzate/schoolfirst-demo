import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, Subject, of, throwError } from 'rxjs';
import { StudentsService } from '../students.service';
import { StudentsApiActions, StudentsPageActions } from './students.actions';
import { searchStudents } from './students.effects';

describe('searchStudents effect', () => {
  let actions$: Subject<Action>;
  let api: jasmine.SpyObj<StudentsService>;

  beforeEach(() => {
    // controla el tiempo para probar el debounce; mockDate hace que Date.now (que usa RxJS) también avance
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 0, 1));
    actions$ = new Subject<Action>();
    api = jasmine.createSpyObj<StudentsService>('StudentsService', ['search']);
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$ as Observable<Action>),
        { provide: StudentsService, useValue: api },
      ],
    });
  });

  afterEach(() => jasmine.clock().uninstall());

  it('espera 300 ms y solo busca el último término', () => {
    api.search.and.returnValue(of([]));
    const results: Action[] = [];
    TestBed.runInInjectionContext(() => searchStudents()).subscribe(a => results.push(a));

    actions$.next(StudentsPageActions.searchChanged({ query: 'a' }));
    jasmine.clock().tick(100);
    actions$.next(StudentsPageActions.searchChanged({ query: 'an' }));
    jasmine.clock().tick(300);

    expect(api.search).toHaveBeenCalledOnceWith('an');
    expect(results).toEqual([StudentsApiActions.loadSuccess({ students: [] })]);
  });

  it('despacha loadFailure si la API falla y el effect sigue vivo', () => {
    api.search.and.returnValues(throwError(() => new Error('500')), of([]));
    const results: Action[] = [];
    TestBed.runInInjectionContext(() => searchStudents()).subscribe(a => results.push(a));

    actions$.next(StudentsPageActions.searchChanged({ query: 'x' }));
    jasmine.clock().tick(300);
    actions$.next(StudentsPageActions.searchChanged({ query: 'y' }));
    jasmine.clock().tick(300);

    expect(results[0].type).toBe(StudentsApiActions.loadFailure.type);
    expect(results[1]).toEqual(StudentsApiActions.loadSuccess({ students: [] }));
  });
});

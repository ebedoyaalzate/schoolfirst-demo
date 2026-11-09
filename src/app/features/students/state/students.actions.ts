import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Student } from '../student.model';

/** Convención: [Origen] Evento. Los eventos describen QUÉ pasó, no qué hacer. */
export const StudentsPageActions = createActionGroup({
  source: 'Students Page',
  events: {
    'Search Changed': props<{ query: string }>(),
    'Student Selected': props<{ id: number }>(),
    'Selection Cleared': emptyProps(),
  },
});

export const StudentsApiActions = createActionGroup({
  source: 'Students API',
  events: {
    'Load Success': props<{ students: Student[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

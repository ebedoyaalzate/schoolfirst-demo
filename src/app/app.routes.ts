import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { authGuard } from './core/auth/auth.guard';
import { studentsFeature } from './features/students/state/students.reducer';
import * as studentsEffects from './features/students/state/students.effects';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  {
    path: 'login',
    // Lazy loading: el componente se descarga solo al visitar la ruta.
    loadComponent: () => import('./features/auth/login').then(m => m.Login),
  },
  {
    path: 'students',
    canActivate: [authGuard],
    // El estado y los effects de la feature se registran solo cuando se carga la ruta.
    providers: [provideState(studentsFeature), provideEffects(studentsEffects)],
    loadComponent: () => import('./features/students/students-page').then(m => m.StudentsPage),
  },
  {
    path: 'exercises',
    loadComponent: () => import('./features/exercises/exercises-page').then(m => m.ExercisesPage),
  },
  { path: '**', redirectTo: 'students' },
];

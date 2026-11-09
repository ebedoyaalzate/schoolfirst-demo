import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { mockBackendInterceptor } from './core/api/mock-backend.interceptor';

// Angular 21+ es zoneless por defecto: el change detection lo disparan signals y eventos, no zone.js.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // El orden importa: authInterceptor agrega el token antes de que el mock lo revise.
    provideHttpClient(withInterceptors([authInterceptor, mockBackendInterceptor])),
    provideStore(),
    provideEffects(),
  ],
};

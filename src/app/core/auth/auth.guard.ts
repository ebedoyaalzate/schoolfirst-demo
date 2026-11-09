import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Guard funcional: si no hay sesión, redirige a /login (UrlTree en vez de navigate). */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? true : inject(Router).createUrlTree(['/login']);
};

/** Guard por rol, configurable desde la ruta: canActivate: [roleGuard('admin')] */
export const roleGuard =
  (role: 'admin' | 'teacher'): CanActivateFn =>
  () =>
    inject(AuthService).user()?.role === role || inject(Router).createUrlTree(['/students']);

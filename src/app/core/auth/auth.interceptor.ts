import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/** Interceptor funcional: agrega el token y cierra sesión ante un 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // En producción aquí se intentaría primero un refresh del token.
      if (err.status === 401 && !req.url.includes('/login') && !req.url.includes('/mfa')) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};

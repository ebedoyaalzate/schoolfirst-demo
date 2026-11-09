import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { delay, of, throwError, mergeMap } from 'rxjs';
import { Student } from '../../features/students/student.model';

/**
 * Backend falso para que el ejemplo corra sin servidor.
 * Usuario: ana@school.com / 123456  ·  código MFA: 000000
 */
const STUDENTS: Student[] = [
  { id: 1, name: 'Ana Gómez', grade: 9, email: 'ana.g@school.com', average: 4.6 },
  { id: 2, name: 'Bruno Díaz', grade: 10, email: 'bruno@school.com', average: 3.9 },
  { id: 3, name: 'Carla Ruiz', grade: 9, email: 'carla@school.com', average: 4.2 },
  { id: 4, name: 'Daniel Mora', grade: 11, email: 'daniel@school.com', average: 3.5 },
  { id: 5, name: 'Elena Torres', grade: 10, email: 'elena@school.com', average: 4.8 },
  { id: 6, name: 'Felipe Castro', grade: 11, email: 'felipe@school.com', average: 4.0 },
];

const ok = (body: unknown) => of(new HttpResponse({ status: 200, body })).pipe(delay(400));
const fail = (status: number, message: string) =>
  of(null).pipe(
    delay(400),
    mergeMap(() => throwError(() => new HttpErrorResponse({ status, error: { message } }))),
  );

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;
  const data = body as Record<string, string> | null;

  if (url.endsWith('/api/login') && method === 'POST') {
    return data?.['email'] === 'ana@school.com' && data?.['password'] === '123456'
      ? ok({ mfaRequired: true, mfaToken: 'tmp-mfa-token' })
      : fail(401, 'Credenciales inválidas');
  }

  if (url.endsWith('/api/mfa/verify') && method === 'POST') {
    return data?.['code'] === '000000' && data?.['mfaToken'] === 'tmp-mfa-token'
      ? ok({
          mfaRequired: false,
          accessToken: 'fake-jwt',
          user: { email: 'ana@school.com', name: 'Ana', role: 'teacher' },
        })
      : fail(401, 'Código incorrecto');
  }

  if (url.includes('/api/students') && method === 'GET') {
    if (req.headers.get('Authorization') !== 'Bearer fake-jwt') return fail(401, 'No autorizado');
    const q = (req.params.get('q') ?? '').toLowerCase();
    return ok(STUDENTS.filter(s => s.name.toLowerCase().includes(q)));
  }

  return next(req);
};

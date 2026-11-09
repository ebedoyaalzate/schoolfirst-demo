import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // falla si quedó alguna petición sin responder

  it('queda en estado "MFA pendiente" si el backend lo pide', () => {
    service.login('ana@school.com', '123456').subscribe();

    const req = http.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ mfaRequired: true, mfaToken: 'tmp' });

    expect(service.mfaPending()).toBeTrue();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('inicia la sesión después de verificar el código', () => {
    service.login('ana@school.com', '123456').subscribe();
    http.expectOne('/api/login').flush({ mfaRequired: true, mfaToken: 'tmp' });

    service.verifyMfa('000000').subscribe();
    const req = http.expectOne('/api/mfa/verify');
    expect(req.request.body).toEqual({ code: '000000', mfaToken: 'tmp' });
    req.flush({ mfaRequired: false, accessToken: 'jwt', user: { email: 'a', name: 'Ana', role: 'teacher' } });

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.mfaPending()).toBeFalse();
    expect(service.user()?.name).toBe('Ana');
  });
});

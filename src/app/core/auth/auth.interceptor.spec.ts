import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  const token = signal<string | null>('jwt-123');
  const authMock = { token, logout: jasmine.createSpy('logout') };
  let http: HttpClient;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  it('agrega el header Authorization', () => {
    http.get('/api/students').subscribe();
    const req = ctrl.expectOne('/api/students');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-123');
    req.flush([]);
  });

  it('cierra sesión ante un 401', () => {
    http.get('/api/students').subscribe({ error: () => {} });
    ctrl.expectOne('/api/students').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(authMock.logout).toHaveBeenCalled();
  });
});

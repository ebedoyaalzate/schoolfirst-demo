import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const loggedIn = signal(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: computed(() => loggedIn()) } },
      ],
    });
  });

  // runInInjectionContext permite probar guards funcionales que usan inject()
  const run = () => TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

  it('deja pasar con sesión', () => {
    loggedIn.set(true);
    expect(run()).toBeTrue();
  });

  it('redirige a /login sin sesión', () => {
    loggedIn.set(false);
    const result = run() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });
});

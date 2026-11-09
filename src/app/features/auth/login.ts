import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, exhaustMap, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Login en dos pasos: credenciales → código MFA.
 * exhaustMap ignora clics repetidos mientras hay una petición en curso (evita doble envío).
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected auth = inject(AuthService);

  protected error = signal<string | null>(null);
  protected submitting = signal(false);

  protected credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected mfa = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  private loginClicks$ = new Subject<void>();
  private mfaClicks$ = new Subject<void>();

  constructor() {
    // catchError va DENTRO del exhaustMap: si va afuera, el primer error completa
    // el stream y los siguientes clics ya no harían nada.
    this.loginClicks$
      .pipe(
        exhaustMap(() => {
          const { email, password } = this.credentials.getRawValue();
          return this.auth.login(email, password).pipe(
            catchError(() => {
              this.fail('Email o contraseña incorrectos');
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe(res => this.done(res.mfaRequired ? null : '/students'));

    this.mfaClicks$
      .pipe(
        exhaustMap(() =>
          this.auth.verifyMfa(this.mfa.getRawValue().code).pipe(
            catchError(() => {
              this.fail('Código incorrecto, intenta de nuevo');
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.done('/students'));
  }

  protected submitCredentials(): void {
    if (this.credentials.invalid) {
      this.credentials.markAllAsTouched();
      return;
    }
    this.start();
    this.loginClicks$.next();
  }

  protected submitCode(): void {
    if (this.mfa.invalid) {
      this.mfa.markAllAsTouched();
      return;
    }
    this.start();
    this.mfaClicks$.next();
  }

  private start(): void {
    this.error.set(null);
    this.submitting.set(true);
  }

  private done(redirect: string | null): void {
    this.submitting.set(false);
    if (redirect) this.router.navigateByUrl(redirect);
  }

  private fail(message: string): void {
    this.submitting.set(false);
    this.error.set(message);
  }
}

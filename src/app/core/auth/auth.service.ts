import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, SessionResponse, User } from './auth.models';

/**
 * Estado de autenticación con signals.
 * El access token vive solo en memoria (no en localStorage) para reducir el riesgo de XSS.
 * En producción el refresh token iría en una cookie httpOnly que JavaScript no puede leer.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<User | null>(null);
  private readonly _mfaToken = signal<string | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly mfaPending = computed(() => this._mfaToken() !== null);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/login', { email, password }).pipe(
      tap(res => {
        if (res.mfaRequired) this._mfaToken.set(res.mfaToken);
        else this.startSession(res);
      }),
    );
  }

  verifyMfa(code: string): Observable<SessionResponse> {
    return this.http
      .post<SessionResponse>('/api/mfa/verify', { code, mfaToken: this._mfaToken() })
      .pipe(tap(res => this.startSession(res)));
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this._mfaToken.set(null);
    this.router.navigate(['/login']);
  }

  private startSession(res: SessionResponse): void {
    this._mfaToken.set(null);
    this._token.set(res.accessToken);
    this._user.set(res.user);
  }
}

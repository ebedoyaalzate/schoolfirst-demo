export interface User {
  email: string;
  name: string;
  role: 'admin' | 'teacher';
}

/** Paso 1: credenciales correctas, pero falta el segundo factor. */
export interface MfaRequiredResponse {
  mfaRequired: true;
  mfaToken: string; // token temporal, solo sirve para verificar el código
}

/** Paso 2 (o login sin MFA): sesión completa. */
export interface SessionResponse {
  mfaRequired: false;
  accessToken: string;
  user: User;
}

export type LoginResponse = MfaRequiredResponse | SessionResponse;

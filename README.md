# SchoolFirst demo — Angular 22 senior example

Login con MFA + lista de estudiantes con búsqueda, NgRx, SignalStore, signals, @defer y tests.

## Correr
```bash
npm install
npx ng serve            # http://localhost:4200
npx ng test             # Jasmine + Karma (16 tests)
npm i -D cypress && npx cypress open   # E2E (con ng serve corriendo)
```
Demo: `ana@school.com` / `123456` · código MFA `000000` (backend falso en `core/api/mock-backend.interceptor.ts`).

## Estructura
```
src/app/
  app.config.ts            providers: router, HttpClient + interceptores, NgRx
  app.routes.ts            rutas lazy, guard, estado NgRx por ruta
  core/
    auth/                  AuthService (signals), interceptor, guards, modelos
    api/                   backend falso para la demo
  features/
    auth/login.*           login en 2 pasos (credenciales → MFA), exhaustMap
    students/
      students-page.*      componente smart: store + búsqueda
      components/          StudentCard (input/output), StudentDetail (@defer)
      state/               actions, reducer + selectors (createFeature), effects, SignalStore
cypress/e2e/               prueba E2E del flujo completo
```

/// <reference types="cypress" />
// Instalar una vez: npm i -D cypress  ·  Correr: npx ng serve  y en otra terminal  npx cypress open

describe('Login con MFA y búsqueda de estudiantes', () => {
  beforeEach(() => cy.visit('/'));

  it('redirige a /login si no hay sesión', () => {
    cy.url().should('include', '/login');
  });

  it('muestra error con credenciales inválidas', () => {
    cy.get('[data-cy=email]').type('ana@school.com');
    cy.get('[data-cy=password]').type('wrong1');
    cy.get('[data-cy=login]').click();
    cy.get('[role=alert]').should('contain', 'incorrectos');
  });

  it('entra con MFA y filtra la lista', () => {
    cy.get('[data-cy=email]').type('ana@school.com');
    cy.get('[data-cy=password]').type('123456');
    cy.get('[data-cy=login]').click();

    cy.get('[data-cy=mfa-code]').type('000000');
    cy.get('[data-cy=verify]').click();

    cy.url().should('include', '/students');
    cy.get('app-student-card').should('have.length', 6);

    cy.get('[data-cy=search]').type('car');
    cy.get('app-student-card').should('have.length', 1).and('contain', 'Carla');
  });
});

// Con un backend real, se simula la API con cy.intercept:
// cy.intercept('GET', '/api/students*', { fixture: 'students.json' }).as('students');
// cy.wait('@students');

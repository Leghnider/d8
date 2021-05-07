// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
Cypress.Commands.add("signup", (firstName, lastName, age, email, password) => {
  cy.visit('/register');
  cy.get('#register-form').find('#firstName').type(firstName);
  cy.get('#register-form').find('#lastName').type(lastName);
  cy.get('#register-form').find('#age').type(age);
  cy.get('#register-form').find('#email').type(email);
  cy.get('#register-form').find('#password').type(password);
  cy.get('#register-form').submit();
})

Cypress.Commands.add("createProfile", (username, bio, location, age, gender, interested_in) => {
  cy.get('#register-profile-form').find('#username').type(username);
  cy.get('#register-profile-form').find('#bio').type(bio);
  cy.get('#register-profile-form').find('#location').type(location);
  cy.get('#register-profile-form').find('#age').type(age);
  cy.get('#register-profile-form').find('#gender').type(gender);
  cy.get('#register-profile-form').find('#interested_in').type(interested_in);
  cy.get('#register-profile-form').submit();
})

Cypress.Commands.add("login", (email, password) => {
  cy.visit('/login');
  cy.get('#log-in-form').find('#email').type(email);
  cy.get('#log-in-form').find('#password').type(password);
  cy.get('#log-in-form').submit();
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

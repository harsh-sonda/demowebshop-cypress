import NavigationPage from './navigation';
import RegisterPage from './register';
import { generateRandomEmail } from '../utils/helper';

const projects = require('../../fixtures/projects.json');
const registerData = require('../../fixtures/registerData.json');

/**
 * Login Page - Login, logout, and password recovery flows
 */
class LoginPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get pageHeading() {
    return cy.contains('h1', projects.login.pageTitle);
  }

  get emailInput() {
    return cy.get('#Email');
  }

  get passwordInput() {
    return cy.get('#Password');
  }

  get rememberMeCheckbox() {
    return cy.get('#RememberMe');
  }

  get loginButton() {
    return cy.get('.login-button');
  }

  get loginLink() {
    return cy.get('.header-links').contains('a', 'Log in');
  }

  get registerLink() {
    return cy.contains('a', 'Register');
  }

  get accountLink() {
    return cy.get('.header-links').contains('a', projects.login.accountLinkText);
  }

  get logoutLink() {
    return cy.get('.header-links a[href="/logout"]');
  }

  get validationSummary() {
    return cy.get('.validation-summary-errors');
  }

  get forgotPasswordLink() {
    return cy.contains('a', 'Forgot password?');
  }

  get passwordRecoveryEmailInput() {
    return cy.get('#Email');
  }

  get recoverButton() {
    return cy.get("input[name='send-email']");
  }

  getCredentials(email, password) {
    return cy.task('loadRegisteredUser').then((storedUser) => {
      return {
        email: email || Cypress.env('REGISTER_EMAIL') || (storedUser && storedUser.email) || '',
        password: password || Cypress.env('REGISTER_PASSWORD') || (storedUser && storedUser.password) || ''
      };
    });
  }

  verifyLoginPageElements() {
    this.loginLink.click();
    cy.url().should('match', /\/login$/);
    this.pageHeading.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.loginButton.should('be.visible');
    this.registerLink.should('be.visible');
  }

  loginIntoApplication(email, password) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    this.loginButton.click();
    this.logoutLink.should('be.visible');
  }

  loginWithValidCredentials() {
    const email = generateRandomEmail();
    const password = registerData.password;
    
    this.verifyLoginPageElements();
    this.logout();

    const registerPage = new RegisterPage();
    registerPage.registerNewUser(email, password);
    
    this.logout();
    cy.get('.header-links').contains('a', 'Log in').click();
    cy.get('#Email').clear().type(email);
    cy.get('#Password').clear().type(password);
    cy.get('.login-button').click();
    cy.get('.header-links a[href="/logout"]').should('be.visible');
  }

  loginWithInvalidPassword() {
    this.verifyLoginPageElements();
    this.logout();
    this.verifyInvalidLogin('bad@example.com', 'wrong');
  }

  loginWithEmptyCredentials() {
    this.verifyLoginPageElements();
    this.logout();
    this.loginButton.click();

    this.validationSummary.should('be.visible');
    this.validationSummary.should('contain.text', projects.login.invalidLoginMessage);
    cy.get('.header-links a[href="/logout"]').should('not.exist');
  }

  loginWithInvalidEmailFormat() {
    this.verifyLoginPageElements();
    this.logout();

    this.emailInput.clear().type('not-an-email');
    this.passwordInput.clear().type(registerData.password);
    this.loginButton.click();

    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.get('.header-links a[href="/logout"]').should('not.exist');
  }

  loginThenLogout() {
    this.loginWithValidCredentials();
    this.logout();

    this.loginLink.should('be.visible');
    cy.get('.header-links a[href="/logout"]').should('not.exist');
  }

  recoverPasswordForRegisteredUser() {
    const email = generateRandomEmail();
    const password = registerData.password;
    
    this.verifyLoginPageElements();
    this.logout();

    const registerPage = new RegisterPage();
    registerPage.registerNewUser(email, password);
    
    this.logout();
    cy.get('.header-links').contains('a', 'Log in').click();
    cy.contains('a', 'Forgot password?').click();
    this.verifyPasswordRecoveryPage();
    cy.get('#Email').clear().type(email);
    cy.get("input[name='send-email']").click();

    cy.contains(projects.passwordRecovery.successMessage).should('be.visible');
  }

  verifyPasswordRecoveryRequiresEmail() {
    this.loginLink.click();
    this.forgotPasswordLink.click();
    this.verifyPasswordRecoveryPage();
    this.recoverButton.click();

    cy.contains(projects.passwordRecovery.emailRequiredMessage).should('be.visible');
  }

  verifyInvalidLogin(email, password) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    this.loginButton.click();

    this.validationSummary.should('be.visible');
    this.validationSummary.should('contain.text', projects.login.invalidLoginMessage);
    cy.get('.header-links a[href="/logout"]').should('not.exist');
  }

  logout() {
    cy.get('body').then(($body) => {
      if ($body.find('.header-links a[href="/logout"]').length > 0) {
        cy.get('.header-links a[href="/logout"]').click();
        cy.get('.header-links a[href="/logout"]').should('not.exist');
      }
    });
  }

  verifyPasswordRecoveryPage() {
    cy.url().should('match', /\/passwordrecovery$/);
    cy.contains('h1', projects.passwordRecovery.pageTitle).should('be.visible');
    this.passwordRecoveryEmailInput.should('be.visible');
    this.recoverButton.should('be.visible');
  }
}

export default LoginPage;

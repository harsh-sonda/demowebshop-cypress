import NavigationPage from './navigation';
import { generateRandomEmail, generateRandomName } from '../utils/helper';

const registerData = require('../../fixtures/registerData.json');
const projects = require('../../fixtures/projects.json');

/**
 * Register Page - User registration flows and validation
 */
class RegisterPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get pageHeading() {
    return cy.contains('h1', projects.register.pageTitle);
  }

  get genderMale() {
    return cy.get('#gender-male');
  }

  get genderFemale() {
    return cy.get('#gender-female');
  }

  get firstNameInput() {
    return cy.get('#FirstName');
  }

  get lastNameInput() {
    return cy.get('#LastName');
  }

  get emailInput() {
    return cy.get('#Email');
  }

  get passwordInput() {
    return cy.get('#Password');
  }

  get confirmPasswordInput() {
    return cy.get('#ConfirmPassword');
  }

  get registerButton() {
    return cy.get('#register-button');
  }

  get registerLink() {
    return cy.get('.header-links').contains('a', 'Register');
  }

  get logoutLink() {
    return cy.get('.header-links a[href="/logout"]');
  }

  get successMessage() {
    return cy.contains(projects.register.successMessage);
  }

  verifyRegisterPageElements() {
    this.registerLink.click();
    cy.url().should('match', /\/register$/);
    this.pageHeading.should('be.visible');
    this.firstNameInput.should('be.visible');
    this.lastNameInput.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.confirmPasswordInput.should('be.visible');
    this.registerButton.should('be.visible');
  }

  registerNewUser(email, password, firstName, lastName) {
    this.verifyRegisterPageElements();

    const userEmail = email || Cypress.env('REGISTER_EMAIL') || generateRandomEmail();
    const userPassword = password || Cypress.env('REGISTER_PASSWORD') || registerData.password;
    const userFirstName = firstName || generateRandomName('First');
    const userLastName = lastName || generateRandomName('Last');
    const gender = registerData.gender;

    this.fillRegistrationForm(userEmail, userPassword, userPassword, userFirstName, userLastName, gender);
    this.registerButton.click();

    this.successMessage.should('be.visible');
    cy.url().should('include', 'registerresult').then(() => {
      return cy.wrap({
        email: userEmail,
        password: userPassword,
        firstName: userFirstName,
        lastName: userLastName,
        gender
      });
    });
  }

  registerNewUserWithValidData() {
    const email = generateRandomEmail();
    const password = registerData.password;
    
    this.verifyRegisterPageElements();

    const userFirstName = generateRandomName('First');
    const userLastName = generateRandomName('Last');
    const gender = registerData.gender;

    this.fillRegistrationForm(email, password, password, userFirstName, userLastName, gender);
    this.registerButton.click();

    this.successMessage.should('be.visible');
    cy.url().should('include', 'registerresult');

    const user = {
      email,
      password,
      firstName: userFirstName,
      lastName: userLastName,
      gender
    };

    cy.task('saveRegisteredUser', user);
  }

  registerWithInvalidData(email, password, confirmPassword, expectedMessage = projects.register.passwordMismatchMessage) {
    this.verifyRegisterPageElements();
    this.fillRegistrationForm(email, password, confirmPassword);
    this.registerButton.click();

    cy.contains(expectedMessage).should('be.visible');
    cy.contains(projects.register.successMessage).should('not.exist');
  }

  registerWithRequiredFieldsMissing() {
    this.verifyRegisterPageElements();
    this.registerButton.click();

    projects.register.requiredFieldMessages.forEach((message) => {
      cy.contains(message).should('be.visible');
    });
    cy.contains(projects.register.successMessage).should('not.exist');
  }

  registerWithInvalidEmail() {
    this.registerWithInvalidData(
      'not-an-email',
      registerData.password,
      registerData.password,
      projects.register.invalidEmailMessage
    );
  }

  registerWithPasswordMismatch() {
    this.registerWithInvalidData(
      generateRandomEmail(),
      registerData.password,
      `${registerData.password}Mismatch`,
      projects.register.passwordMismatchMessage
    );
  }

  registerWithDuplicateEmail() {
    const email = generateRandomEmail();
    const password = registerData.password;

    this.registerNewUser(email, password);
    this.logout();
    this.verifyRegisterPageElements();
    this.fillRegistrationForm(email, password, password);
    this.registerButton.click();

    cy.contains(projects.register.duplicateEmailMessage).should('be.visible');
    cy.contains(projects.register.successMessage).should('not.exist');
  }

  logout() {
    cy.get('body').then(($body) => {
      if ($body.find('.header-links a[href="/logout"]').length > 0) {
        cy.get('.header-links a[href="/logout"]').click();
        cy.get('.header-links a[href="/logout"]').should('not.exist');
      }
    });
  }

  fillRegistrationForm(email, password, confirmPassword, firstName = generateRandomName('First'), lastName = generateRandomName('Last'), gender = registerData.gender) {
    if (gender === 'Male') {
      this.genderMale.click();
    } else {
      this.genderFemale.click();
    }

    this.firstNameInput.clear().type(firstName);
    this.lastNameInput.clear().type(lastName);
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    this.confirmPasswordInput.clear().type(confirmPassword);
  }
}

export default RegisterPage;

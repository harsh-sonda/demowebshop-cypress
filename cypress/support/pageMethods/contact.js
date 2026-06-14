import NavigationPage from './navigation';

const projects = require('../../fixtures/projects.json');

/**
 * Contact Page - Contact form operations
 */
class ContactPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get fullNameInput() {
    return cy.get('#FullName');
  }

  get emailInput() {
    return cy.get('#Email');
  }

  get enquiryInput() {
    return cy.get('#Enquiry');
  }

  get submitButton() {
    return cy.get("input[name='send-email']");
  }

  get fieldValidationErrors() {
    return cy.get('.field-validation-error');
  }

  submitContactForm(contact) {
    this.navigationPage.openFooterLink('Contact us');
    cy.contains('h1', projects.contact.pageTitle).should('be.visible');

    this.fullNameInput.clear().type(contact.fullName);
    this.emailInput.clear().type(contact.email);
    this.enquiryInput.clear().type(contact.enquiry);
    this.submitButton.click();

    cy.contains(projects.contact.successMessage).should('be.visible');
  }

  verifyRequiredFieldValidation() {
    this.navigationPage.openFooterLink('Contact us');
    this.submitButton.click();

    this.fieldValidationErrors.first().should('be.visible');
  }
}

export default ContactPage;

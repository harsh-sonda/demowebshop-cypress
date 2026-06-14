import NavigationPage from './navigation';

const projects = require('../../fixtures/projects.json');

/**
 * Newsletter Page - Newsletter subscription operations
 */
class NewsletterPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get emailInput() {
    return cy.get('#newsletter-email');
  }

  get subscribeButton() {
    return cy.get('#newsletter-subscribe-button');
  }

  get resultBlock() {
    return cy.get('#newsletter-result-block');
  }

  subscribeWithValidEmail(email) {
    this.navigationPage.goHome();
    this.emailInput.clear().type(email);
    this.subscribeButton.click();

    this.resultBlock.should('be.visible');
    this.resultBlock.should('contain.text', projects.newsletter.successMessage);
  }

  subscribeWithInvalidEmail(email) {
    this.navigationPage.goHome();
    this.emailInput.clear().type(email);
    this.subscribeButton.click();

    this.resultBlock.should('be.visible');
    this.resultBlock.should('contain.text', projects.newsletter.invalidEmailMessage);
  }
}

export default NewsletterPage;

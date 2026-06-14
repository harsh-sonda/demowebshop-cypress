import NavigationPage from './navigation';
import RegisterPage from './register';
import OrderPage from './order';
import { generateRandomEmail } from '../utils/helper';

const accountData = require('../../fixtures/accountData.json');
const projects = require('../../fixtures/projects.json');
const registerData = require('../../fixtures/registerData.json');

/**
 * Account Page - Account management operations
 */
class AccountPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get accountLink() {
    return cy.get(".header-links a[href='/customer/info']");
  }

  get firstNameInput() {
    return cy.get('#FirstName');
  }

  get lastNameInput() {
    return cy.get('#LastName');
  }

  get femaleGender() {
    return cy.get('#gender-female');
  }

  get saveButton() {
    return cy.get("input[name='save-info-button']");
  }

  updateCustomerInfo() {
    this.registerUser();
    this.openCustomerInfo();

    this.femaleGender.click();
    this.firstNameInput.clear().type(accountData.customer.firstName);
    this.lastNameInput.clear().type(accountData.customer.lastName);
    this.saveButton.click();

    this.firstNameInput.should('have.value', accountData.customer.firstName);
    this.lastNameInput.should('have.value', accountData.customer.lastName);
  }

  verifyAccountNavigationLinks() {
    this.registerUser();
    this.openCustomerInfo();

    cy.get('.block-account-navigation').contains('a', 'Addresses').click();
    cy.contains('h1', projects.account.addressesTitle).should('be.visible');

    cy.get('.block-account-navigation').contains('a', 'Orders').click();
    cy.contains('h1', projects.account.ordersTitle).should('be.visible');

    cy.get('.block-account-navigation').contains('a', 'Customer info').click();
    cy.contains('h1', projects.account.customerInfoTitle).should('be.visible');
  }

  verifyLoggedInOrderHistory() {
    const orderPage = new OrderPage();
    orderPage.createLoggedInOrderWithCreditCardPayment().then((orderNumber) => {
      this.navigationPage.openFooterLink('Orders');
      cy.contains('h1', projects.account.ordersTitle).should('be.visible');
      cy.contains(orderNumber).should('be.visible');
    });
  }

  openCustomerInfo() {
    this.accountLink.click();
    cy.contains('h1', projects.account.customerInfoTitle).should('be.visible');
  }

  registerUser() {
    const registerPage = new RegisterPage();
    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
  }
}

export default AccountPage;

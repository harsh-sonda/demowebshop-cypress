import NavigationPage from './navigation';
import RegisterPage from './register';
import { generateRandomEmail } from '../utils/helper';

const accountData = require('../../fixtures/accountData.json');
const projects = require('../../fixtures/projects.json');
const registerData = require('../../fixtures/registerData.json');

/**
 * Address Page - Address management operations
 */
class AddressPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get addNewButton() {
    return cy.contains('button', 'Add new');
  }

  get saveButton() {
    return cy.contains('button', 'Save');
  }

  addEditAndDeleteAddress() {
    this.registerUser();
    this.openAddresses();
    this.addAddress({
      ...accountData.address,
      email: generateRandomEmail()
    });
    this.editAddress();
    this.deleteAddress();
  }

  openAddresses() {
    cy.get(".header-links a[href='/customer/info']").click();
    this.navigationPage.openAccountNavigationLink('Addresses');
    cy.contains('h1', projects.account.addressesTitle).should('be.visible');
  }

  addAddress(address) {
    this.addNewButton.click();
    this.fillAddressForm(address);
    this.saveButton.click();

    cy.contains(address.city).should('be.visible');
  }

  editAddress() {
    cy.get('.edit-address-button').first().click();

    cy.get('#Address_City').clear().type(accountData.editedAddress.city);
    cy.get('#Address_Address1').clear().type(accountData.editedAddress.address1);
    cy.get('#Address_ZipPostalCode').clear().type(accountData.editedAddress.zipPostalCode);
    cy.get('#Address_PhoneNumber').clear().type(accountData.editedAddress.phoneNumber);
    this.saveButton.click();

    cy.contains(accountData.editedAddress.city).should('be.visible');
  }

  deleteAddress() {
    cy.on('window:confirm', () => true);

    cy.contains('button', 'Delete').first().then(($button) => {
      const onclick = $button.attr('onclick');
      const deletePath = onclick.match(/'(\/customer\/addressdelete\/\d+)'/)?.[1];

      if (deletePath) {
        cy.intercept('**/customer/addressdelete/*').as('deleteRequest');
        $button.click();
        cy.wait('@deleteRequest');
      } else {
        $button.click();
      }
    });
  }

  fillAddressForm(address) {
    cy.get('#Address_FirstName').clear().type(address.firstName);
    cy.get('#Address_LastName').clear().type(address.lastName);
    cy.get('#Address_Email').clear().type(address.email);
    cy.get('#Address_Company').clear().type(address.company);
    cy.get('#Address_CountryId').select(address.countryValue);
    cy.get('#Address_City').clear().type(address.city);
    cy.get('#Address_Address1').clear().type(address.address1);
    if (address.address2) {
      cy.get('#Address_Address2').clear().type(address.address2);
    }
    cy.get('#Address_ZipPostalCode').clear().type(address.zipPostalCode);
    cy.get('#Address_PhoneNumber').clear().type(address.phoneNumber);
    if (address.faxNumber) {
      cy.get('#Address_FaxNumber').clear().type(address.faxNumber);
    }
  }

  registerUser() {
    const registerPage = new RegisterPage();
    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
  }
}

export default AddressPage;

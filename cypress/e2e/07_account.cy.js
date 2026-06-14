import AccountPage from '../support/pageMethods/account';
import AddressPage from '../support/pageMethods/address';

describe('Account Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Update customer information', () => {
    const accountPage = new AccountPage();
    accountPage.updateCustomerInfo();
  });

  it('Add, edit, and delete an address', () => {
    const addressPage = new AddressPage();
    addressPage.addEditAndDeleteAddress();
  });

  it('Verify account navigation links', () => {
    const accountPage = new AccountPage();
    accountPage.verifyAccountNavigationLinks();
  });

  it('Logged-in order appears in order history', () => {
    const accountPage = new AccountPage();
    accountPage.verifyLoggedInOrderHistory();
  });
});

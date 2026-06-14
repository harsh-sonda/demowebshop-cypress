import LoginPage from '../support/pageMethods/login';

describe('Login Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Login with valid credentials', () => {
    const loginPage = new LoginPage();
    loginPage.loginWithValidCredentials();
  });

  it('Login fails with invalid password', () => {
    const loginPage = new LoginPage();
    loginPage.loginWithInvalidPassword();
  });

  it('Login fails with empty credentials', () => {
    const loginPage = new LoginPage();
    loginPage.loginWithEmptyCredentials();
  });

  it('Login fails with invalid email format', () => {
    const loginPage = new LoginPage();
    loginPage.loginWithInvalidEmailFormat();
  });

  it('User can log out after login', () => {
    const loginPage = new LoginPage();
    loginPage.loginThenLogout();
  });

  it('Recover password for registered user', () => {
    const loginPage = new LoginPage();
    loginPage.recoverPasswordForRegisteredUser();
  });

  it('Password recovery requires email', () => {
    const loginPage = new LoginPage();
    loginPage.verifyPasswordRecoveryRequiresEmail();
  });
});

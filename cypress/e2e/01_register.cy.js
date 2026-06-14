import RegisterPage from '../support/pageMethods/register';

describe('Register Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Register a new user with valid data', () => {
    const registerPage = new RegisterPage();
    registerPage.registerNewUserWithValidData();
  });

  it('Register shows required field validation', () => {
    const registerPage = new RegisterPage();
    registerPage.registerWithRequiredFieldsMissing();
  });

  it('Register fails with invalid email', () => {
    const registerPage = new RegisterPage();
    registerPage.registerWithInvalidEmail();
  });

  it('Register fails when passwords do not match', () => {
    const registerPage = new RegisterPage();
    registerPage.registerWithPasswordMismatch();
  });

  it('Register fails with duplicate email', () => {
    const registerPage = new RegisterPage();
    registerPage.registerWithDuplicateEmail();
  });
});

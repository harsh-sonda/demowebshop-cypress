/**
 * Custom Cypress commands for Demo Web Shop E2E tests
 */

/**
 * Fill an input field after clearing it
 * @param {string} selector - CSS selector for the input
 * @param {string} value - Value to type
 */
Cypress.Commands.add('inputField', (selector, value) => {
  cy.get(selector).clear().type(value);
});

/**
 * Click a web element
 * @param {string} selector - CSS selector for the element
 */
Cypress.Commands.add('clickWebElement', (selector) => {
  cy.get(selector).click();
});

/**
 * Assert element visibility
 * @param {string} selector - CSS selector for the element
 */
Cypress.Commands.add('visibilityOfElement', (selector) => {
  cy.get(selector).should('be.visible');
});

/**
 * Assert current page URL contains expected path
 * @param {string} expectedUrl - Expected URL or path
 */
Cypress.Commands.add('assertPageUrl', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
});

/**
 * Generate a random email address
 * @returns {string} Random email
 */
Cypress.Commands.add('generateRandomEmail', () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `test_${timestamp}_${random}@example.com`;
});

/**
 * Generate a random name
 * @returns {string} Random name
 */
Cypress.Commands.add('generateRandomName', () => {
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return { firstName: randomName, lastName: randomSurname };
});

/**
 * Login with stored or provided credentials
 * @param {string} email - Email address
 * @param {string} password - Password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#Email').clear().type(email);
  cy.get('#Password').clear().type(password);
  cy.get('input.login-button').click();
});

/**
 * Logout if logged in
 */
Cypress.Commands.add('logoutIfLoggedIn', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.header-links a[href="/logout"]').length > 0) {
      cy.get('.header-links a[href="/logout"]').click();
    }
  });
});

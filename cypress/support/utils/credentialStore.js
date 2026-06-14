/**
 * Credential store utilities for persisting registered user data across specs.
 * Uses cy.task to interact with the Node.js file system.
 */

/**
 * Save a registered user to the store
 * @param {Object} user - User object with email, password, firstName, lastName, gender
 * @returns {Cypress.Chainable}
 */
export function saveRegisteredUser(user) {
  const envEmail = Cypress.env('REGISTER_EMAIL');
  const envPassword = Cypress.env('REGISTER_PASSWORD');

  const record = {
    ...user,
    email: envEmail || user.email,
    password: envPassword || user.password,
    registeredAt: new Date().toISOString()
  };

  return cy.task('saveRegisteredUser', record).then(() => record);
}

/**
 * Load a registered user from the store
 * @returns {Cypress.Chainable<Object|null>}
 */
export function loadRegisteredUser() {
  return cy.task('loadRegisteredUser').then((user) => {
    if (!user) return null;

    const envEmail = Cypress.env('REGISTER_EMAIL');
    const envPassword = Cypress.env('REGISTER_PASSWORD');

    return {
      ...user,
      email: envEmail || user.email,
      password: envPassword || user.password || ''
    };
  });
}

/**
 * Clear the registered user from the store
 * @returns {Cypress.Chainable}
 */
export function clearRegisteredUser() {
  return cy.task('clearRegisteredUser');
}

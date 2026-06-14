/**
 * Generate a random email address
 * @returns {string} Random email
 */
export function generateRandomEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `qa.user.${timestamp}.${random}@example.com`;
}

/**
 * Generate a random name with prefix
 * @param {string} prefix - Prefix for the name
 * @returns {string} Random name
 */
export function generateRandomName(prefix) {
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${random}`;
}

/**
 * Generate random first and last names
 * @returns {{ firstName: string, lastName: string }}
 */
export function generateRandomFullName() {
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return { firstName: randomName, lastName: randomSurname };
}

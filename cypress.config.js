const { defineConfig } = require('cypress');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const baseUrl = process.env.BASE_URL;

module.exports = defineConfig({
  e2e: {
    baseUrl,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    retries: {
      runMode: 1,
      openMode: 0
    },
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      config.env.REGISTER_EMAIL = process.env.REGISTER_EMAIL || '';
      config.env.REGISTER_PASSWORD = process.env.REGISTER_PASSWORD || '';

      const registeredUserPath = path.join(__dirname, 'cypress/fixtures/registeredUser.json');

      on('task', {
        saveRegisteredUser(user) {
          fs.writeFileSync(registeredUserPath, JSON.stringify(user, null, 2));
          return null;
        },
        loadRegisteredUser() {
          if (fs.existsSync(registeredUserPath)) {
            const data = fs.readFileSync(registeredUserPath, 'utf8');
            return JSON.parse(data);
          }
          return null;
        },
        clearRegisteredUser() {
          if (fs.existsSync(registeredUserPath)) {
            fs.unlinkSync(registeredUserPath);
          }
          return null;
        }
      });

      return config;
    }
  }
});

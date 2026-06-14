# Demo Web Shop - Cypress E2E Tests

End-to-end test automation framework for [Demo Web Shop](https://demowebshop.tricentis.com) using Cypress and JavaScript.

## Prerequisites

- Node.js (LTS version recommended)
- npm

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
BASE_URL=https://demowebshop.tricentis.com
REGISTER_EMAIL=your-email@example.com
REGISTER_PASSWORD=your-password
```

## Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npm run cy:open
```

### Run Tests in Headless Mode

```bash
npm run cy:run
```

### Run Tests in Headed Mode

```bash
npm run cy:run:headed
```

### Run Tests in Chrome

```bash
npm run cy:run:chrome
```

## Project Structure

```
demowebshop-cypress/
├── cypress/
│   ├── e2e/                    # Test specs
│   │   ├── 01_register.cy.js
│   │   ├── 02_login.cy.js
│   │   ├── 03_create_order.cy.js
│   │   ├── 04_catalog.cy.js
│   │   ├── 05_search.cy.js
│   │   ├── 06_wishlist_compare.cy.js
│   │   ├── 07_account.cy.js
│   │   └── 08_site_features.cy.js
│   ├── fixtures/               # Test data JSON files
│   ├── support/
│   │   ├── commands.js         # Custom Cypress commands
│   │   ├── e2e.js              # Support file entry point
│   │   ├── pageMethods/        # Page object classes
│   │   └── utils/              # Helper utilities
│   └── videos/                 # Test run videos (gitignored)
├── cypress.config.js           # Cypress configuration
├── package.json
└── README.md
```

## Test Suites

| Suite | Description |
|-------|-------------|
| 01_register | User registration flows and validation |
| 02_login | Login, logout, and password recovery |
| 03_create_order | Shopping cart and checkout flows |
| 04_catalog | Category navigation and product listing |
| 05_search | Search functionality |
| 06_wishlist_compare | Wishlist and compare features |
| 07_account | Account management and addresses |
| 08_site_features | Contact, newsletter, polls, reviews |

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/cypress.yml`) that runs tests on push and pull request events.

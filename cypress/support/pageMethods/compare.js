import ProductPage from './product';

const projects = require('../../fixtures/projects.json');

/**
 * Compare Page - Product comparison operations
 */
class ComparePage {
  constructor() {
    this.productPage = new ProductPage();
  }

  addProductsAndVerify(products) {
    products.forEach((product) => {
      this.productPage.addProductToCompareList(product.name);
    });

    cy.contains('h1', projects.compare.pageTitle).should('be.visible');

    products.forEach((product) => {
      cy.contains('a', product.name).should('be.visible');
    });
  }

  clearCompareList(products) {
    this.addProductsAndVerify(products);
    cy.contains('a', 'Clear list').click();

    cy.url().should('match', /\/compareproducts$/);
    cy.contains(projects.compare.emptyMessage).should('be.visible');
  }
}

export default ComparePage;

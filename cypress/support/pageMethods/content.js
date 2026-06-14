import NavigationPage from './navigation';
import ProductPage from './product';

/**
 * Content Page - Footer information links and content pages
 */
class ContentPage {
  constructor() {
    this.navigationPage = new NavigationPage();
    this.productPage = new ProductPage();
  }

  verifyFooterInformationLinks(links) {
    links.forEach((link) => {
      this.navigationPage.goHome();
      this.navigationPage.openFooterLink(link.name);

      cy.url().should('match', new RegExp(`${link.path}$`));
      cy.contains('h1', link.heading, { matchCase: false }).should('be.visible');
    });
  }

  verifyRecentlyViewedProduct(productName) {
    this.productPage.openProduct(productName);
    this.navigationPage.openFooterLink('Recently viewed products');

    cy.contains('h1', 'Recently viewed products').should('be.visible');
    cy.contains('a', productName).should('be.visible');
  }

  verifyNewProductsPage() {
    this.navigationPage.openFooterLink('New products');

    cy.contains('h1', 'New products').should('be.visible');
    cy.get('.product-item').first().should('be.visible');
  }
}

export default ContentPage;

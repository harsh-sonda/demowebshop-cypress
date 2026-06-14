import ProductPage from './product';

const projects = require('../../fixtures/projects.json');

/**
 * Wishlist Page - Wishlist operations
 */
class WishlistPage {
  constructor() {
    this.productPage = new ProductPage();
  }

  get wishlistLink() {
    return cy.get('.header-links').contains('a', /Wishlist/i);
  }

  get updateWishlistButton() {
    return cy.get("input[name='updatecart']");
  }

  get addToCartButton() {
    return cy.get("input[name='addtocartbutton']");
  }

  get emptyWishlistMessage() {
    return cy.contains(projects.wishlist.emptyMessage);
  }

  addProductAndVerify(product) {
    this.productPage.addProductToWishlist(product.name);
    this.openWishlist();
    this.productRow(product.name).should('be.visible');
  }

  removeProduct(product) {
    this.addProductAndVerify(product);

    this.productRow(product.name).within(() => {
      cy.get("input[name='removefromcart']").check();
    });
    this.updateWishlistButton.click();

    this.emptyWishlistMessage.should('be.visible');
  }

  moveProductToCart(product) {
    this.addProductAndVerify(product);

    this.productRow(product.name).within(() => {
      cy.get("input[name='addtocart']").check();
    });
    this.addToCartButton.click();

    cy.url().should('match', /\/cart$/);
    cy.contains('a', product.name).should('be.visible');
  }

  openWishlist() {
    this.wishlistLink.click();
    cy.url().should('match', /\/wishlist$/);
    cy.contains('h1', projects.wishlist.pageTitle).should('be.visible');
  }

  productRow(productName) {
    return cy.get('.cart-item-row').contains('a', productName).parents('.cart-item-row');
  }
}

export default WishlistPage;

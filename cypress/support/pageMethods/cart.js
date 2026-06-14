import NavigationPage from './navigation';

const projects = require('../../fixtures/projects.json');

/**
 * Cart Page - Shopping cart operations
 */
class CartPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get cartLink() {
    return cy.get('.header-links').contains('a', /Shopping cart/i);
  }

  get pageHeading() {
    return cy.contains('h1', projects.order.cartPageTitle);
  }

  get termsOfServiceCheckbox() {
    return cy.get('#termsofservice');
  }

  get checkoutButton() {
    return cy.get('#checkout');
  }

  get updateCartButton() {
    return cy.get("input[name='updatecart']");
  }

  get emptyCartMessage() {
    return cy.contains(projects.cart.emptyCartMessage);
  }

  verifyCartPageElements() {
    this.cartLink.click();
    cy.url().should('match', /\/cart$/);
    this.pageHeading.should('be.visible');
    this.termsOfServiceCheckbox.should('be.visible');
    this.checkoutButton.should('be.visible');
  }

  acceptTermsAndCheckout(expectedUrl = /\/login\/checkoutasguest/) {
    this.verifyCartPageElements();

    this.termsOfServiceCheckbox.then(($checkbox) => {
      if (!$checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });

    this.checkoutButton.click();
    cy.url().should('match', expectedUrl);
  }

  verifyProductInCart(productName) {
    this.verifyCartPageElements();
    this.productRow(productName).should('be.visible');
  }

  updateProductQuantity(productName, quantity) {
    this.verifyCartPageElements();

    this.productRow(productName).within(() => {
      cy.get('input.qty-input').clear().type(quantity);
    });
    this.updateCartButton.click();

    this.productRow(productName).find('input.qty-input').should('have.value', quantity);
    this.cartLink.should('contain.text', `(${quantity})`);
  }

  removeProductFromCart(productName) {
    this.verifyCartPageElements();

    this.productRow(productName).within(() => {
      cy.get("input[name='removefromcart']").check();
    });
    this.updateCartButton.click();

    this.emptyCartMessage.should('be.visible');
    this.cartLink.should('contain.text', '(0)');
  }

  verifyCheckoutRequiresTermsOfService() {
    this.verifyCartPageElements();

    this.termsOfServiceCheckbox.then(($checkbox) => {
      if ($checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });

    this.checkoutButton.click();
    cy.contains(projects.cart.termsOfServiceMessage).should('be.visible');
    cy.url().should('match', /\/cart$/);
  }

  verifyCartIsEmpty() {
    this.navigationPage.openHeaderLink(/Shopping cart/i);
    this.emptyCartMessage.should('be.visible');
    this.cartLink.should('contain.text', '(0)');
  }

  productRow(productName) {
    return cy.get('.cart-item-row').contains('a', productName).parents('.cart-item-row');
  }
}

export default CartPage;

import NavigationPage from './navigation';
import { generateRandomEmail } from '../utils/helper';

const projects = require('../../fixtures/projects.json');

/**
 * Product Page - Product details, configuration, wishlist, compare, and reviews
 */
class ProductPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get productName() {
    return cy.get('.product-name h1');
  }

  get productPrice() {
    return cy.get('.product-price');
  }

  get successNotification() {
    return cy.get('.bar-notification.success');
  }

  get addToCartButton() {
    return cy.get('.add-to-cart-button').first();
  }

  get addToWishlistButton() {
    return cy.get('.add-to-wishlist-button').first();
  }

  get addToCompareButton() {
    return cy.get('.add-to-compare-list-button').first();
  }

  openProduct(productName) {
    this.navigationPage.openProductBySearch(productName);
    this.productName.should('be.visible');
  }

  verifyProductDetails(product) {
    this.openProduct(product.name);

    this.productName.should('contain.text', product.name);
    if (product.price) {
      this.productPrice.should('contain.text', product.price);
    }
    cy.get('.product-review-links a').first().should('be.visible');
    cy.contains('a', 'Add your review').should('be.visible');
  }

  addCurrentProductToCart(productName) {
    this.addToCartButton.click();
    this.expectSuccessNotification('The product has been added to your shopping cart');
    cy.get('.header-links .cart-qty').invoke('text').should('match', /\([1-9]\d*\)/);
  }

  configureComputerAndAddToCart(product) {
    this.openProduct(product.name);

    this.selectOptionContaining('#product_attribute_16_5_4', product.processor);
    this.selectOptionContaining('#product_attribute_16_6_5', product.ram);
    this.checkAttributeOption(product.hdd);
    this.checkAttributeOption(product.os);

    product.software.forEach((software) => {
      this.checkAttributeOption(software);
    });

    this.addCurrentProductToCart(product.name);
  }

  fillGiftCardAndAddToCart(product) {
    this.openProduct(product.name);

    cy.get('input[id$="_RecipientName"]').clear().type(product.recipientName);
    cy.get('input[id$="_RecipientEmail"]').clear().type(product.recipientEmail);
    cy.get('input[id$="_SenderName"]').clear().type(product.senderName);
    cy.get('input[id$="_SenderEmail"]').clear().type(generateRandomEmail());
    cy.get('textarea[id$="_Message"]').clear().type(product.message);

    this.addCurrentProductToCart(product.name);
  }

  addProductToWishlist(productName) {
    this.openProduct(productName);
    this.fillGiftCardFieldsIfPresent();
    this.addToWishlistButton.click();
    this.expectSuccessNotification(projects.wishlist.successMessage);
  }

  addProductToCompareList(productName) {
    this.openProduct(productName);
    this.addToCompareButton.click();
    cy.url().should('match', /\/compareproducts$/);
  }

  submitReview(review) {
    this.openReviewForm(review.productName);
    this.fillReviewForm(review);
    cy.get(`#addproductrating_${review.rating}`).check();
    this.submitReviewButton();

    cy.contains('Product review is successfully added.', { timeout: 60000 }).should('be.visible');
  }

  verifyReviewRequiresTitle(review) {
    this.openReviewForm(review.productName);
    this.fillReviewForm({ ...review, title: '' });
    this.submitReviewButton();

    cy.contains(projects.review.titleRequiredMessage, { timeout: 60000 }).should('be.visible');
  }

  verifyReviewRequiresText(review) {
    this.openReviewForm(review.productName);
    this.fillReviewForm({ ...review, text: '' });
    this.submitReviewButton();

    cy.contains(projects.review.textRequiredMessage, { timeout: 60000 }).should('be.visible');
  }

  expectSuccessNotification(message) {
    cy.get('.bar-notification.success', { timeout: 30000 }).should('be.visible');
    cy.get('.bar-notification.success').should('contain.text', message);
  }

  openReviewForm(productName) {
    this.openProduct(productName);
    cy.contains('a', 'Add your review').click();
    cy.get('#AddProductReview_Title', { timeout: 60000 }).should('be.visible');
  }

  fillReviewForm(review) {
    if (review.title) {
      cy.get('#AddProductReview_Title').clear().type(review.title);
    } else {
      cy.get('#AddProductReview_Title').clear();
    }
    if (review.text) {
      cy.get('#AddProductReview_ReviewText').clear().type(review.text);
    } else {
      cy.get('#AddProductReview_ReviewText').clear();
    }
  }

  submitReviewButton() {
    cy.get("input.write-product-review-button[value='Submit review']").click();
  }

  fillGiftCardFieldsIfPresent() {
    cy.get('body').then(($body) => {
      if ($body.find('#giftcard_2_RecipientName').length > 0) {
        cy.get('#giftcard_2_RecipientName').clear().type('Wishlist Recipient');
        cy.get('#giftcard_2_RecipientEmail').clear().type('wishlist.recipient@example.com');
        cy.get('#giftcard_2_SenderName').clear().type('Wishlist Sender');
        cy.get('#giftcard_2_SenderEmail').clear().type(generateRandomEmail());
      }
    });
  }

  selectOptionContaining(selector, text) {
    cy.get(selector).then(($select) => {
      const $option = $select.find('option').filter((i, el) => el.textContent.includes(text)).first();
      if ($option.length) {
        cy.get(selector).select($option.val());
      } else {
        throw new Error(`Could not find select option containing "${text}"`);
      }
    });
  }

  checkAttributeOption(labelText) {
    cy.get('.attributes li').contains(labelText).closest('li').find('input').first().check();
  }
}

export default ProductPage;

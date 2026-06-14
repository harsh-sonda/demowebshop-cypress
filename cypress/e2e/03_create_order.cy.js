import CatalogPage from '../support/pageMethods/catalog';
import CartPage from '../support/pageMethods/cart';
import OrderPage from '../support/pageMethods/order';

const orderData = require('../fixtures/orderData.json');

describe('Create Order Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Update product quantity in cart', () => {
    const catalogPage = new CatalogPage();
    const cartPage = new CartPage();

    catalogPage.addProductToCart(orderData.product.categoryName, orderData.product.name);
    cartPage.updateProductQuantity(orderData.product.name, '2');
  });

  it('Remove product from cart', () => {
    const catalogPage = new CatalogPage();
    const cartPage = new CartPage();

    catalogPage.addProductToCart(orderData.product.categoryName, orderData.product.name);
    cartPage.removeProductFromCart(orderData.product.name);
  });

  it('Checkout is blocked until terms of service are accepted', () => {
    const catalogPage = new CatalogPage();
    const cartPage = new CartPage();

    catalogPage.addProductToCart(orderData.product.categoryName, orderData.product.name);
    cartPage.verifyCheckoutRequiresTermsOfService();
  });

  it('Create a guest order with credit card payment', () => {
    const orderPage = new OrderPage();
    orderPage.createGuestOrderWithCreditCardPayment();
  });

  orderData.shippingMethods.forEach((shippingMethod) => {
    it(`Create a guest order with ${shippingMethod} shipping`, () => {
      const orderPage = new OrderPage();
      orderPage.createGuestOrderWithShippingMethod(shippingMethod);
    });
  });

  orderData.paymentMethods.forEach((paymentMethod) => {
    it(`Create a guest order with ${paymentMethod} payment`, () => {
      const orderPage = new OrderPage();
      orderPage.createGuestOrderWithPaymentMethod(paymentMethod);
    });
  });

  it('Guest checkout validates missing billing address', () => {
    const orderPage = new OrderPage();
    orderPage.verifyGuestCheckoutRequiresBillingAddress();
  });

  it('Guest checkout rejects invalid credit card', () => {
    const orderPage = new OrderPage();
    orderPage.verifyGuestCheckoutRejectsInvalidCreditCard();
  });

  it('Cart is empty after successful order', () => {
    const orderPage = new OrderPage();
    orderPage.verifyCartIsEmptyAfterSuccessfulOrder();
  });
});

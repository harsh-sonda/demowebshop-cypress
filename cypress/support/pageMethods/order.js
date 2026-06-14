import CatalogPage from './catalog';
import CartPage from './cart';
import CheckoutPage from './checkout';
import RegisterPage from './register';
import { generateRandomEmail } from '../utils/helper';

const orderData = require('../../fixtures/orderData.json');
const projects = require('../../fixtures/projects.json');
const registerData = require('../../fixtures/registerData.json');

/**
 * Order Page - End-to-end order creation flows
 */
class OrderPage {
  constructor() {
    this.catalogPage = new CatalogPage();
    this.cartPage = new CartPage();
    this.checkoutPage = new CheckoutPage();
  }

  createGuestOrderWithCreditCardPayment() {
    this.addConfiguredBookAndStartGuestCheckout();
    return this.completeCreditCardCheckout(this.buildBillingAddress()).then((orderResult) => {
      this.verifyOrderResult(orderResult);
    });
  }

  createGuestOrderWithCreditCardPaymentResult() {
    this.addConfiguredBookAndStartGuestCheckout();
    return this.completeCreditCardCheckout(this.buildBillingAddress());
  }

  createGuestOrderWithShippingMethod(shippingMethod) {
    this.addConfiguredBookAndStartGuestCheckout();
    return this.completeCreditCardCheckout(
      this.buildBillingAddress(),
      orderData.payment,
      shippingMethod
    ).then((orderResult) => {
      this.verifyOrderResult(orderResult);
    });
  }

  createGuestOrderWithPaymentMethod(paymentMethod) {
    this.addConfiguredBookAndStartGuestCheckout();
    return this.completeCheckoutWithPaymentMethod(
      this.buildBillingAddress(),
      paymentMethod
    ).then((orderResult) => {
      this.verifyOrderResult(orderResult);
    });
  }

  verifyGuestCheckoutRequiresBillingAddress() {
    this.addConfiguredBookAndStartGuestCheckout();
    this.checkoutPage.verifyBillingAddressValidation();
  }

  verifyGuestCheckoutRejectsInvalidCreditCard() {
    this.addConfiguredBookAndStartGuestCheckout();
    this.checkoutPage.fillBillingAddress(this.buildBillingAddress());
    this.checkoutPage.continueFromBillingAddress();
    this.checkoutPage.continueWithBillingAsShippingAddress();
    this.checkoutPage.selectShippingMethod(orderData.shippingMethod);
    this.checkoutPage.selectPaymentMethod(orderData.payment.method);
    this.checkoutPage.fillCreditCardPayment({
      ...orderData.payment,
      cardNumber: '123'
    });
    this.checkoutPage.verifyInvalidPaymentInformation();
  }

  createLoggedInOrderWithCreditCardPayment() {
    const registerPage = new RegisterPage();
    return registerPage.registerNewUser(generateRandomEmail(), registerData.password).then((user) => {
      this.catalogPage.addProductToCart(orderData.product.categoryName, orderData.product.name);
      this.cartPage.acceptTermsAndCheckout(/\/onepagecheckout$/);
      this.checkoutPage.verifyCheckoutPage();

      return this.completeCreditCardCheckout(this.buildBillingAddress(user.email)).then((orderResult) => {
        this.verifyOrderResult(orderResult);
        return orderResult.orderNumber.replace('Order number:', '').trim();
      });
    });
  }

  verifyCartIsEmptyAfterSuccessfulOrder() {
    this.createGuestOrderWithCreditCardPayment();
    this.cartPage.verifyCartIsEmpty();
  }

  addConfiguredBookAndStartGuestCheckout() {
    this.catalogPage.addProductToCart(orderData.product.categoryName, orderData.product.name);
    this.cartPage.acceptTermsAndCheckout();
    this.checkoutPage.startGuestCheckout();
  }

  completeCreditCardCheckout(billingAddress, payment = orderData.payment, shippingMethod = orderData.shippingMethod) {
    this.checkoutPage.fillBillingAddress(billingAddress);
    this.checkoutPage.continueFromBillingAddress();
    this.checkoutPage.continueWithBillingAsShippingAddress();
    this.checkoutPage.selectShippingMethod(shippingMethod);
    this.checkoutPage.selectPaymentMethod(payment.method);
    this.checkoutPage.fillCreditCardPayment(payment);
    this.checkoutPage.continueFromPaymentInformation();

    return this.checkoutPage.confirmOrder();
  }

  completeCheckoutWithPaymentMethod(billingAddress, paymentMethod) {
    this.checkoutPage.fillBillingAddress(billingAddress);
    this.checkoutPage.continueFromBillingAddress();
    this.checkoutPage.continueWithBillingAsShippingAddress();
    this.checkoutPage.selectShippingMethod(orderData.shippingMethod);
    this.checkoutPage.selectPaymentMethod(paymentMethod, false);
    this.checkoutPage.continueFromPaymentInformation();

    return this.checkoutPage.confirmOrder();
  }

  buildBillingAddress(email = generateRandomEmail()) {
    return {
      ...orderData.billingAddress,
      email
    };
  }

  verifyOrderResult(orderResult) {
    expect(orderResult.successMessage).to.equal(projects.order.orderSuccessMessage);
    expect(orderResult.orderNumber).to.match(/^Order number:\s+\d+$/);
  }
}

export default OrderPage;

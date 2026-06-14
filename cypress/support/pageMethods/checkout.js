const projects = require('../../fixtures/projects.json');

/**
 * Checkout Page - Checkout flow and payment processing
 */
class CheckoutPage {
  get checkoutAsGuestButton() {
    return cy.get("input[value='Checkout as Guest']");
  }

  get pageHeading() {
    return cy.contains('h1', projects.order.checkoutPageTitle);
  }

  get billingFirstNameInput() {
    return cy.get('#BillingNewAddress_FirstName');
  }

  get billingLastNameInput() {
    return cy.get('#BillingNewAddress_LastName');
  }

  get billingEmailInput() {
    return cy.get('#BillingNewAddress_Email');
  }

  get billingCompanyInput() {
    return cy.get('#BillingNewAddress_Company');
  }

  get billingCountrySelect() {
    return cy.get('#BillingNewAddress_CountryId');
  }

  get billingCityInput() {
    return cy.get('#BillingNewAddress_City');
  }

  get billingAddress1Input() {
    return cy.get('#BillingNewAddress_Address1');
  }

  get billingAddress2Input() {
    return cy.get('#BillingNewAddress_Address2');
  }

  get billingZipPostalCodeInput() {
    return cy.get('#BillingNewAddress_ZipPostalCode');
  }

  get billingPhoneNumberInput() {
    return cy.get('#BillingNewAddress_PhoneNumber');
  }

  get billingFaxNumberInput() {
    return cy.get('#BillingNewAddress_FaxNumber');
  }

  get billingContinueButton() {
    return cy.get("#billing-buttons-container input[value='Continue']");
  }

  get shippingAddressContinueButton() {
    return cy.get("#shipping-buttons-container input[value='Continue']");
  }

  get shippingMethodContinueButton() {
    return cy.get("#shipping-method-buttons-container input[value='Continue']");
  }

  get paymentMethodContinueButton() {
    return cy.get("#payment-method-buttons-container input[value='Continue']");
  }

  get paymentInfoContinueButton() {
    return cy.get("#payment-info-buttons-container input[value='Continue']");
  }

  get confirmOrderButton() {
    return cy.get("#confirm-order-buttons-container input[value='Confirm']");
  }

  get orderSuccessMessage() {
    return cy.contains(projects.order.orderSuccessMessage);
  }

  get orderNumber() {
    return cy.get('.order-completed .details li').contains('Order number:');
  }

  get fieldValidationErrors() {
    return cy.get('.field-validation-error');
  }

  startGuestCheckout() {
    this.checkoutAsGuestButton.click();
    cy.url().should('match', /\/onepagecheckout$/);
    this.pageHeading.should('be.visible');
  }

  verifyCheckoutPage() {
    cy.url().should('match', /\/onepagecheckout$/);
    this.pageHeading.should('be.visible');
  }

  fillBillingAddress(address) {
    this.billingFirstNameInput.clear().type(address.firstName);
    this.billingLastNameInput.clear().type(address.lastName);
    this.billingEmailInput.clear().type(address.email);
    this.billingCompanyInput.clear().type(address.company);
    this.billingCountrySelect.select(address.countryValue);
    this.billingCityInput.clear().type(address.city);
    this.billingAddress1Input.clear().type(address.address1);
    if (address.address2) {
      this.billingAddress2Input.clear().type(address.address2);
    }
    this.billingZipPostalCodeInput.clear().type(address.zipPostalCode);
    this.billingPhoneNumberInput.clear().type(address.phoneNumber);
    if (address.faxNumber) {
      this.billingFaxNumberInput.clear().type(address.faxNumber);
    }
  }

  continueFromBillingAddress() {
    this.billingContinueButton.click();
    cy.get('body', { timeout: 30000 }).should(($body) => {
      const hasShippingAddress = $body.find("#shipping-buttons-container input[value='Continue']:visible").length > 0;
      const hasShippingMethod = $body.find("#shipping-method-buttons-container input[value='Continue']:visible").length > 0;
      expect(hasShippingAddress || hasShippingMethod).to.be.true;
    });
  }

  verifyBillingAddressValidation() {
    this.billingContinueButton.click();
    this.fieldValidationErrors.first().should('contain.text', projects.order.billingRequiredMessage);
  }

  continueWithBillingAsShippingAddress() {
    cy.get('body').then(($body) => {
      if ($body.find("#shipping-method-buttons-container input[value='Continue']:visible").length > 0) {
        return;
      }
      cy.get("#shipping-buttons-container input[value='Continue']").click();
      cy.get("#shipping-method-buttons-container input[value='Continue']").should('be.visible');
    });
  }

  selectShippingMethod(methodName) {
    cy.contains('#checkout-shipping-method-load li', methodName).within(() => {
      cy.get("input[name='shippingoption']").check();
    });
    cy.contains('#checkout-shipping-method-load li', methodName).find("input[name='shippingoption']").should('be.checked');
    this.shippingMethodContinueButton.click();
    this.paymentMethodContinueButton.should('be.visible');
  }

  selectPaymentMethod(methodName, expectsCreditCardInfo = methodName === 'Credit Card') {
    cy.contains('#checkout-payment-method-load li', methodName).within(() => {
      cy.get("input[name='paymentmethod']").check();
    });
    cy.contains('#checkout-payment-method-load li', methodName).find("input[name='paymentmethod']").should('be.checked');
    this.paymentMethodContinueButton.click();

    if (expectsCreditCardInfo) {
      cy.get('#CardholderName').should('be.visible');
    } else {
      this.paymentInfoContinueButton.should('be.visible');
    }
  }

  fillCreditCardPayment(payment) {
    cy.get('#CreditCardType').select(payment.creditCardType);
    cy.get('#CardholderName').clear().type(payment.cardholderName);
    cy.get('#CardNumber').clear().type(payment.cardNumber);
    cy.get('#ExpireMonth').select(payment.expireMonth);
    cy.get('#ExpireYear').select(payment.expireYear);
    cy.get('#CardCode').clear().type(payment.cardCode);
  }

  continueFromPaymentInformation() {
    this.paymentInfoContinueButton.click();
    this.confirmOrderButton.should('be.visible');
  }

  verifyInvalidPaymentInformation() {
    this.paymentInfoContinueButton.click();
    cy.contains(projects.order.paymentValidationMessage).should('be.visible');
  }

  confirmOrder() {
    this.confirmOrderButton.click();
    cy.url().should('match', /\/checkout\/completed/);
    this.orderSuccessMessage.should('be.visible');
    this.orderNumber.should('contain.text', 'Order number:');

    return this.orderNumber.invoke('text').then((text) => {
      return {
        successMessage: projects.order.orderSuccessMessage,
        orderNumber: text.trim()
      };
    });
  }
}

export default CheckoutPage;

/**
 * Navigation Page - Common header, menu, footer, and search navigation methods
 */
class NavigationPage {
  get logoLink() {
    return cy.get('.header-logo a');
  }

  get searchInput() {
    return cy.get('#small-searchterms');
  }

  get searchButton() {
    return cy.get('.search-box-button');
  }

  goHome() {
    this.logoLink.click();
  }

  openHeaderLink(name) {
    cy.get('.header-links').contains('a', name).click();
  }

  openTopMenuLink(name) {
    cy.get('.header-menu').contains('a', name).first().click();
  }

  openFooterLink(name) {
    cy.get('.footer').contains('a', name).click();
  }

  openAccountNavigationLink(name) {
    cy.get('.block-account-navigation').contains('a', name).click();
  }

  openProductBySearch(productName) {
    this.searchInput.clear().type(productName);
    this.searchButton.click();
    cy.contains('a', productName).first().click();
  }
}

export default NavigationPage;

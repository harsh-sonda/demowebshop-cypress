import NavigationPage from './navigation';

const projects = require('../../fixtures/projects.json');

/**
 * Search Page - Search functionality
 */
class SearchPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get headerSearchInput() {
    return cy.get('#small-searchterms');
  }

  get headerSearchButton() {
    return cy.get('.search-box-button');
  }

  get keywordInput() {
    return cy.get('#Q');
  }

  get advancedSearchCheckbox() {
    return cy.get('#As');
  }

  get categorySelect() {
    return cy.get('#Cid');
  }

  get subcategoryCheckbox() {
    return cy.get('#Isc');
  }

  get manufacturerSelect() {
    return cy.get('#Mid');
  }

  get priceFromInput() {
    return cy.get('#Pf');
  }

  get priceToInput() {
    return cy.get('#Pt');
  }

  get descriptionsCheckbox() {
    return cy.get('#Sid');
  }

  get searchButton() {
    return cy.get(".search-input input[type='submit']");
  }

  get noResultsMessage() {
    return cy.contains(projects.search.noResultsMessage);
  }

  searchFromHeader(keyword, expectedProduct) {
    this.headerSearchInput.clear().type(keyword);
    this.headerSearchButton.click();

    this.verifySearchResults(expectedProduct);
  }

  verifyNoResults(keyword) {
    this.navigationPage.openFooterLink('Search');
    this.keywordInput.clear().type(keyword);
    this.searchButton.click();

    this.noResultsMessage.should('be.visible');
  }

  advancedSearch(criteria) {
    this.navigationPage.openFooterLink('Search');
    this.keywordInput.clear().type(criteria.keyword);

    this.advancedSearchCheckbox.then(($checkbox) => {
      if (!$checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });

    if (criteria.category) {
      this.categorySelect.select(criteria.category);
    }

    if (criteria.includeSubcategories) {
      this.subcategoryCheckbox.check();
    }

    if (criteria.manufacturer) {
      this.manufacturerSelect.select(criteria.manufacturer);
    }

    if (criteria.priceFrom) {
      this.priceFromInput.clear().type(criteria.priceFrom);
    }

    if (criteria.priceTo) {
      this.priceToInput.clear().type(criteria.priceTo);
    }

    if (criteria.searchDescriptions) {
      this.descriptionsCheckbox.check();
    }

    this.searchButton.click();
    this.verifySearchResults(criteria.expectedProduct);
  }

  verifySearchResults(expectedProduct) {
    cy.url().should('match', /\/search/);
    cy.contains('h1', projects.search.pageTitle).should('be.visible');
    cy.contains('a', expectedProduct).should('be.visible');
  }
}

export default SearchPage;

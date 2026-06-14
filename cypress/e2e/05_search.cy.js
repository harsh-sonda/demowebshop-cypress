import SearchPage from '../support/pageMethods/search';

const searchData = require('../fixtures/searchData.json');

describe('Search Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Search from header returns matching products', () => {
    const searchPage = new SearchPage();
    searchPage.searchFromHeader(searchData.headerSearch.keyword, searchData.headerSearch.expectedProduct);
  });

  it('Search shows no results for unmatched keyword', () => {
    const searchPage = new SearchPage();
    searchPage.verifyNoResults(searchData.noResults.keyword);
  });

  it('Advanced search filters by category, subcategory, and price', () => {
    const searchPage = new SearchPage();
    searchPage.advancedSearch({
      ...searchData.advanced,
      includeSubcategories: true
    });
  });

  it('Advanced search can include product descriptions', () => {
    const searchPage = new SearchPage();
    searchPage.advancedSearch({
      ...searchData.descriptionSearch,
      includeSubcategories: true,
      searchDescriptions: true
    });
  });
});

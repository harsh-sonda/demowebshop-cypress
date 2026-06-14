import CatalogPage from '../support/pageMethods/catalog';
import ProductPage from '../support/pageMethods/product';

const catalogData = require('../fixtures/catalogData.json');

describe('Catalog Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Browse main categories', () => {
    const catalogPage = new CatalogPage();

    catalogData.categories.forEach((category) => {
      catalogPage.verifyCategoryNavigation(category);
    });
  });

  it('Browse selected subcategories', () => {
    const catalogPage = new CatalogPage();

    catalogData.subcategories.forEach((category) => {
      catalogPage.verifySubcategoryNavigation(category);
    });
  });

  it('Change catalog sort, view mode, and page size', () => {
    const catalogPage = new CatalogPage();
    catalogPage.verifyListingControls();
  });

  it('Sort products by price', () => {
    const catalogPage = new CatalogPage();
    catalogPage.verifyPriceSorting();
  });

  it('Open product details', () => {
    const productPage = new ProductPage();
    productPage.verifyProductDetails(catalogData.bookProduct);
  });

  it('Configure computer product and add to cart', () => {
    const productPage = new ProductPage();
    productPage.configureComputerAndAddToCart(catalogData.computerProduct);
  });

  it('Fill virtual gift card fields and add to cart', () => {
    const productPage = new ProductPage();
    productPage.fillGiftCardAndAddToCart(catalogData.giftCardProduct);
  });
});

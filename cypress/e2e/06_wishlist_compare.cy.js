import WishlistPage from '../support/pageMethods/wishlist';
import ComparePage from '../support/pageMethods/compare';

const catalogData = require('../fixtures/catalogData.json');

describe('Wishlist and Compare Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Add product to wishlist', () => {
    const wishlistPage = new WishlistPage();
    wishlistPage.addProductAndVerify(catalogData.giftCardProduct);
  });

  it('Remove product from wishlist', () => {
    const wishlistPage = new WishlistPage();
    wishlistPage.removeProduct(catalogData.giftCardProduct);
  });

  it('Move wishlist product to cart', () => {
    const wishlistPage = new WishlistPage();
    wishlistPage.moveProductToCart(catalogData.giftCardProduct);
  });

  it('Add products to compare list', () => {
    const comparePage = new ComparePage();
    comparePage.addProductsAndVerify(catalogData.compareProducts);
  });

  it('Clear compare list', () => {
    const comparePage = new ComparePage();
    comparePage.clearCompareList(catalogData.compareProducts);
  });
});

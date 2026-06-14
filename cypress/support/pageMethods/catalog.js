import NavigationPage from './navigation';

/**
 * Catalog Page - Category navigation and product listing controls
 */
class CatalogPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get cartQuantity() {
    return cy.get('.header-links .cart-qty');
  }

  get viewModeSelect() {
    return cy.get('#products-viewmode');
  }

  get sortSelect() {
    return cy.get('#products-orderby');
  }

  get pageSizeSelect() {
    return cy.get('#products-pagesize');
  }

  get productItems() {
    return cy.get('.product-item');
  }

  addProductToCart(categoryName, productName) {
    cy.get('.header-menu').contains('a', categoryName).click();

    cy.get('.product-item').contains('a', productName).parents('.product-item').within(() => {
      cy.get('input.product-box-add-to-cart-button').click();
    });

    this.cartQuantity.should('match', /[1-9]/);
  }

  verifyCategoryNavigation(category) {
    this.navigationPage.openTopMenuLink(category.name);

    cy.url().should('match', new RegExp(`${category.path}$`));
    cy.contains('h1', category.name).should('be.visible');
    this.verifyCategoryExpectedContent(category);
  }

  verifySubcategoryNavigation(category) {
    this.openSubcategory(category.name);
    cy.contains('h1', category.name).should('be.visible');
    this.verifyCategoryExpectedContent(category);
  }

  verifyListingControls() {
    this.navigationPage.openTopMenuLink('Books');

    this.sortSelect.select('Name: A to Z');
    cy.url().should('include', 'orderby=5');
    this.productItems.first().should('contain.text', 'Computing and Internet');

    this.viewModeSelect.select('List');
    cy.url().should('include', 'viewmode=list');
    cy.get('.product-list').should('be.visible');

    this.pageSizeSelect.select('4');
    cy.url().should('include', 'pagesize=4');
    this.productItems.should('have.length', 4);
  }

  verifyPriceSorting() {
    this.navigationPage.openTopMenuLink('Books');

    this.sortSelect.select('Price: Low to High');
    cy.url().should('include', 'orderby=10');
    this.expectPricesSorted('ascending');

    this.sortSelect.select('Price: High to Low');
    cy.url().should('include', 'orderby=11');
    this.expectPricesSorted('descending');
  }

  verifyCategoryExpectedContent(category) {
    if (category.expectedProduct) {
      this.productItems.contains('a', category.expectedProduct).should('be.visible');
    }

    if (category.expectedSubcategory) {
      cy.get('.sub-category-item').contains('a', category.expectedSubcategory).should('be.visible');
    }
  }

  openSubcategory(categoryName) {
    const parentCategory = this.parentCategoryFor(categoryName);
    this.navigationPage.openTopMenuLink(parentCategory);
    cy.get('.sub-category-item').contains('a', categoryName).click();
  }

  parentCategoryFor(categoryName) {
    if (['Desktops', 'Notebooks', 'Accessories'].includes(categoryName)) {
      return 'Computers';
    }

    if (['Camera, photo', 'Cell phones'].includes(categoryName)) {
      return 'Electronics';
    }

    throw new Error(`No parent category configured for "${categoryName}".`);
  }

  expectPricesSorted(direction) {
    this.getVisibleActualPrices().then((prices) => {
      const sortedPrices = [...prices].sort((first, second) =>
        direction === 'ascending' ? first - second : second - first
      );
      expect(prices).to.deep.equal(sortedPrices);
    });
  }

  getVisibleActualPrices() {
    return cy.get('.product-item .actual-price').then(($elements) => {
      const prices = [];
      $elements.each((index, el) => {
        prices.push(Number(el.textContent.trim()));
      });
      return prices;
    });
  }
}

export default CatalogPage;

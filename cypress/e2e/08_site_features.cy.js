import ContactPage from '../support/pageMethods/contact';
import ContentPage from '../support/pageMethods/content';
import NewsletterPage from '../support/pageMethods/newsletter';
import PollPage from '../support/pageMethods/poll';
import ProductPage from '../support/pageMethods/product';
import RegisterPage from '../support/pageMethods/register';
import { generateRandomEmail } from '../support/utils/helper';

const catalogData = require('../fixtures/catalogData.json');
const registerData = require('../fixtures/registerData.json');
const siteData = require('../fixtures/siteData.json');

describe('Site Feature Test Cases', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Submit contact us form', () => {
    const contactPage = new ContactPage();
    contactPage.submitContactForm(siteData.contact);
  });

  it('Contact us form validates required fields', () => {
    const contactPage = new ContactPage();
    contactPage.verifyRequiredFieldValidation();
  });

  it('Subscribe to newsletter with valid email', () => {
    const newsletterPage = new NewsletterPage();
    newsletterPage.subscribeWithValidEmail(generateRandomEmail());
  });

  it('Newsletter rejects invalid email', () => {
    const newsletterPage = new NewsletterPage();
    newsletterPage.subscribeWithInvalidEmail(siteData.newsletter.invalidEmail);
  });

  it('Vote in community poll', () => {
    const registerPage = new RegisterPage();
    const pollPage = new PollPage();

    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
    pollPage.voteInCommunityPoll();
  });

  it('Recently viewed products shows visited product', () => {
    const contentPage = new ContentPage();
    contentPage.verifyRecentlyViewedProduct(catalogData.bookProduct.name);
  });

  it('New products page displays products', () => {
    const contentPage = new ContentPage();
    contentPage.verifyNewProductsPage();
  });

  it('Logged-in user can submit a product review', () => {
    const registerPage = new RegisterPage();
    const productPage = new ProductPage();

    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
    productPage.submitReview(siteData.review);
  });

  it('Product review requires title', () => {
    const registerPage = new RegisterPage();
    const productPage = new ProductPage();

    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
    productPage.verifyReviewRequiresTitle(siteData.review);
  });

  it('Product review requires text', () => {
    const registerPage = new RegisterPage();
    const productPage = new ProductPage();

    registerPage.registerNewUser(generateRandomEmail(), registerData.password);
    productPage.verifyReviewRequiresText(siteData.review);
  });

  it('Footer information links open expected pages', () => {
    const contentPage = new ContentPage();
    contentPage.verifyFooterInformationLinks(siteData.contentLinks);
  });
});

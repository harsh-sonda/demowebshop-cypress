import NavigationPage from './navigation';

const projects = require('../../fixtures/projects.json');

/**
 * Poll Page - Community poll operations
 */
class PollPage {
  constructor() {
    this.navigationPage = new NavigationPage();
  }

  get pollBlock() {
    return cy.get('.poll');
  }

  get voteButton() {
    return cy.get('#vote-poll-1');
  }

  voteInCommunityPoll() {
    this.navigationPage.goHome();
    this.pollBlock.should('contain.text', projects.poll.question);

    this.pollBlock.contains('label', 'Excellent').click();
    this.voteButton.click();

    this.pollBlock.find('.poll-results').should('be.visible');
  }
}

export default PollPage;

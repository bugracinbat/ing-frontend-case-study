import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/components/pagination-component.js';
import { LocalizationService } from '../src/services/localization.js';

describe('PaginationComponent', () => {
  let element;

  beforeEach(async () => {
    stub(LocalizationService, 'getCurrentLanguage').returns('en');
    element = await fixture(html`<pagination-component></pagination-component>`);
  });

  afterEach(() => {
    LocalizationService.getCurrentLanguage.restore();
  });

  it('initializes with default values', () => {
    expect(element.currentPage).to.equal(1);
    expect(element.totalPages).to.equal(1);
    expect(element.currentLanguage).to.equal('en');
  });

  it('renders navigation buttons', () => {
    const buttons = element.shadowRoot.querySelectorAll('.nav-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].getAttribute('aria-label')).to.equal('Previous page');
    expect(buttons[1].getAttribute('aria-label')).to.equal('Next page');
  });

  it('disables previous button on first page', async () => {
    element.currentPage = 1;
    element.totalPages = 5;
    await element.updateComplete;
    
    const prevButton = element.shadowRoot.querySelector('.nav-button');
    expect(prevButton.hasAttribute('disabled')).to.be.true;
  });

  it('disables next button on last page', async () => {
    element.currentPage = 5;
    element.totalPages = 5;
    await element.updateComplete;
    
    const nextButton = element.shadowRoot.querySelectorAll('.nav-button')[1];
    expect(nextButton.hasAttribute('disabled')).to.be.true;
  });

  it('emits page-changed event when page button is clicked', async () => {
    element.currentPage = 1;
    element.totalPages = 5;
    await element.updateComplete;

    let eventFired = false;
    let newPage = null;
    element.addEventListener('page-changed', (e) => {
      eventFired = true;
      newPage = e.detail;
    });

    const pageButtons = element.shadowRoot.querySelectorAll('.page-button:not(.nav-button)');
    pageButtons[1].click(); // Click second page button

    expect(eventFired).to.be.true;
    expect(newPage).to.equal(2);
  });

  it('shows correct page range with many pages', async () => {
    element.currentPage = 5;
    element.totalPages = 10;
    await element.updateComplete;

    const pageButtons = element.shadowRoot.querySelectorAll('.page-button:not(.nav-button)');
    const ellipsis = element.shadowRoot.querySelectorAll('.ellipsis');
    
    expect(pageButtons.length).to.be.greaterThan(3); // Should show multiple page buttons
    expect(ellipsis.length).to.be.greaterThan(0); // Should show ellipsis for skipped pages
  });

  it('updates language when language-changed event is dispatched', async () => {
    const event = new CustomEvent('language-changed', {
      detail: { language: 'nl' }
    });
    window.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element.currentLanguage).to.equal('nl');
  });

  it('handles navigation button clicks', async () => {
    element.currentPage = 2;
    element.totalPages = 5;
    await element.updateComplete;

    let eventCount = 0;
    let lastPage = null;
    element.addEventListener('page-changed', (e) => {
      eventCount++;
      lastPage = e.detail;
    });

    const [prevButton, nextButton] = element.shadowRoot.querySelectorAll('.nav-button');
    
    prevButton.click();
    expect(eventCount).to.equal(1);
    expect(lastPage).to.equal(1);

    nextButton.click();
    expect(eventCount).to.equal(2);
    expect(lastPage).to.equal(3);
  });

  it('does not emit event when clicking disabled buttons', async () => {
    element.currentPage = 1;
    element.totalPages = 5;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('page-changed', () => {
      eventFired = true;
    });

    const prevButton = element.shadowRoot.querySelector('.nav-button');
    prevButton.click();

    expect(eventFired).to.be.false;
  });
}); 
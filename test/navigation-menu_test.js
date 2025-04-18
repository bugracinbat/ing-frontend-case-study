import { html, fixture, expect } from '@open-wc/testing';
import { stub } from 'sinon';
import '../src/components/navigation-menu.js';
import { LocalizationService } from '../src/services/localization.js';
import { Router } from '@vaadin/router';

describe('NavigationMenu', () => {
  let element;

  beforeEach(async () => {
    // Stub LocalizationService methods
    stub(LocalizationService, 'getCurrentLanguage').returns('en');
    stub(LocalizationService, 'getAvailableLanguages').returns(['en', 'nl']);
    stub(LocalizationService, 'getTranslation').callsFake((key) => {
      const translations = {
        'navigation.list': 'List',
        'navigation.add': 'Add'
      };
      return translations[key] || key;
    });
    stub(LocalizationService, 'setLanguage');
    
    // Stub Router
    stub(Router, 'go');

    element = await fixture(html`<navigation-menu></navigation-menu>`);
  });

  afterEach(() => {
    // Restore all stubs
    LocalizationService.getCurrentLanguage.restore();
    LocalizationService.getAvailableLanguages.restore();
    LocalizationService.getTranslation.restore();
    LocalizationService.setLanguage.restore();
    Router.go.restore();
  });

  it('renders navigation links', () => {
    const links = element.shadowRoot.querySelectorAll('.nav-links a');
    expect(links.length).to.equal(2);
    expect(links[0].textContent.trim()).to.equal('List');
    expect(links[1].textContent.trim()).to.equal('Add');
  });

  it('renders language toggle buttons', () => {
    const buttons = element.shadowRoot.querySelectorAll('.language-button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].textContent.trim()).to.equal('EN');
    expect(buttons[1].textContent.trim()).to.equal('NL');
  });

  it('marks current language button as active', () => {
    const buttons = element.shadowRoot.querySelectorAll('.language-button');
    expect(buttons[0].classList.contains('active')).to.be.true;
    expect(buttons[1].classList.contains('active')).to.be.false;
  });

  it('changes language when language button is clicked', () => {
    const nlButton = element.shadowRoot.querySelectorAll('.language-button')[1];
    nlButton.click();
    expect(LocalizationService.setLanguage.calledWith('nl')).to.be.true;
  });

  it('navigates to list page when list link is clicked', () => {
    const listLink = element.shadowRoot.querySelector('.nav-links a');
    listLink.click();
    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('navigates to add page when add link is clicked', () => {
    const addLink = element.shadowRoot.querySelectorAll('.nav-links a')[1];
    addLink.click();
    expect(Router.go.calledWith('/add')).to.be.true;
  });

  it('updates active link based on current path', async () => {
    element.currentPath = '/add';
    await element.updateComplete;
    
    const links = element.shadowRoot.querySelectorAll('.nav-links a');
    expect(links[0].classList.contains('active')).to.be.false;
    expect(links[1].classList.contains('active')).to.be.true;
  });

  it('updates language when language-changed event is dispatched', async () => {
    const event = new CustomEvent('language-changed', {
      detail: { language: 'nl' }
    });
    window.dispatchEvent(event);
    await element.updateComplete;
    
    const buttons = element.shadowRoot.querySelectorAll('.language-button');
    expect(buttons[1].classList.contains('active')).to.be.true;
  });
}); 
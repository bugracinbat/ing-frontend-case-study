import { html, render } from 'lit-html';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import '../src/components/confirm-dialog.js';
import { LocalizationService } from '../src/services/localization.js';

describe('ConfirmDialog', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<confirm-dialog></confirm-dialog>`);
    await elementUpdated(element);
  });

  it('is hidden by default', () => {
    const overlay = element.shadowRoot.querySelector('.dialog-overlay');
    expect(overlay.hasAttribute('hidden')).to.be.true;
  });

  it('opens with provided title and message', async () => {
    const title = 'Test Title';
    const message = 'Test Message';
    
    element.open({ title, message, onConfirm: () => {} });
    await elementUpdated(element);

    const overlay = element.shadowRoot.querySelector('.dialog-overlay');
    expect(overlay.hasAttribute('hidden')).to.be.false;

    const dialogTitle = element.shadowRoot.querySelector('.dialog-title');
    expect(dialogTitle.textContent).to.equal(title);

    const dialogMessage = element.shadowRoot.querySelector('.dialog-message');
    expect(dialogMessage.textContent).to.equal(message);
  });

  it('calls onConfirm when proceed button is clicked', async () => {
    let confirmed = false;
    element.open({ 
      title: 'Test', 
      message: 'Test', 
      onConfirm: () => { confirmed = true; } 
    });
    await elementUpdated(element);

    const proceedButton = element.shadowRoot.querySelector('.confirm-button');
    proceedButton.click();
    await elementUpdated(element);

    expect(confirmed).to.be.true;
    expect(element.shadowRoot.querySelector('.dialog-overlay').hasAttribute('hidden')).to.be.true;
  });

  it('closes when cancel button is clicked', async () => {
    element.open({ title: 'Test', message: 'Test', onConfirm: () => {} });
    await elementUpdated(element);

    const cancelButton = element.shadowRoot.querySelector('.cancel-button');
    cancelButton.click();
    await elementUpdated(element);

    expect(element.shadowRoot.querySelector('.dialog-overlay').hasAttribute('hidden')).to.be.true;
  });

  it('updates when language changes', async () => {
    element.open({ title: 'Test', message: 'Test', onConfirm: () => {} });
    await elementUpdated(element);

    const originalProceedText = element.shadowRoot.querySelector('.confirm-button').textContent;
    const originalCancelText = element.shadowRoot.querySelector('.cancel-button').textContent;
    
    // Change language
    LocalizationService.setLanguage('tr');
    await elementUpdated(element);

    const newProceedText = element.shadowRoot.querySelector('.confirm-button').textContent;
    const newCancelText = element.shadowRoot.querySelector('.cancel-button').textContent;

    expect(newProceedText).to.not.equal(originalProceedText);
    expect(newCancelText).to.not.equal(originalCancelText);
  });
}); 
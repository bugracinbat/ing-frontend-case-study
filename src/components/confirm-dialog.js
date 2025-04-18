import { LitElement, html, css } from 'lit-element';
import { LocalizationService } from '../services/localization.js';

class ConfirmDialog extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean },
      title: { type: String },
      message: { type: String },
      onConfirm: { type: Function }
    };
  }

  static styles = css`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--surface);
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      width: 400px;
      max-width: 90%;
      border: 1px solid var(--border-color);
    }

    .dialog-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: var(--primary-color);
      color: white;
      border-radius: 0.375rem;
    }

    .dialog-message {
      margin-bottom: 1.5rem;
      line-height: 1.5;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .dialog-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .confirm-button {
      background: var(--primary-color);
      color: white;
    }

    .cancel-button {
      background: var(--background);
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .confirm-button:hover {
      background: var(--primary-hover);
    }

    .cancel-button:hover {
      background: var(--surface);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    [hidden] {
      display: none;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.onConfirm = null;
    
    this._handleLanguageChange = this._handleLanguageChange.bind(this);
    window.addEventListener('language-changed', this._handleLanguageChange);
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this._handleLanguageChange);
    super.disconnectedCallback();
  }

  _handleLanguageChange() {
    this.requestUpdate();
  }

  open({ title, message, onConfirm }) {
    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.onConfirm = null;
  }

  handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.close();
  }

  render() {
    return html`
      <div class="dialog-overlay" ?hidden=${!this.isOpen}>
        <div class="dialog">
          <div class="dialog-title">${this.title}</div>
          <div class="dialog-message">${this.message}</div>
          <div class="dialog-actions">
            <button class="dialog-button cancel-button" @click=${this.close}>
              ${LocalizationService.getTranslation('dialog.cancel')}
            </button>
            <button class="dialog-button confirm-button" @click=${this.handleConfirm}>
              ${LocalizationService.getTranslation('dialog.proceed')}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);

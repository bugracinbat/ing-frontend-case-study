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
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 400px;
      max-width: 90%;
    }

    .dialog-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 16px;
      padding: 12px;
      background: #ff6200;
      color: white;
      border-radius: 4px;
    }

    .dialog-message {
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .dialog-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .confirm-button {
      background: #ff6200;
      color: white;
    }

    .cancel-button {
      background: #f5f5f5;
      color: #333;
    }

    .confirm-button:hover {
      background: #e55a00;
    }

    .cancel-button:hover {
      background: #e0e0e0;
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

import { LitElement, html, css } from 'lit-element';
import { LocalizationService } from '../services/localization.js';

class PaginationComponent extends LitElement {
  static get properties() {
    return {
      currentPage: { type: Number },
      totalPages: { type: Number },
      currentLanguage: { type: String }
    };
  }

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
    }

    .page-button {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      min-width: 40px;
      text-align: center;
    }

    .page-button:hover {
      background: #f5f5f5;
    }

    .page-button.selected {
      background: var(--pagination-selected-bg, #ff6200);
      color: var(--pagination-selected-color, white);
      border-color: var(--pagination-selected-bg, #ff6200);
    }

    .page-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ellipsis {
      padding: 8px 12px;
      color: #666;
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentLanguage = LocalizationService.getCurrentLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.handleLanguageChange);
    super.disconnectedCallback();
  }

  handleLanguageChange = (e) => {
    this.currentLanguage = e.detail.language;
    this.requestUpdate();
  }

  handlePageChange(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.dispatchEvent(new CustomEvent('page-changed', {
        detail: page,
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    return html`
      <div class="pagination">
        <button 
          @click=${() => this.handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
        >
          ${LocalizationService.getTranslation('pagination.previous')}
        </button>
        
        <span class="page-info">
          ${LocalizationService.getTranslation('pagination.page')} ${this.currentPage} 
          ${LocalizationService.getTranslation('pagination.of')} 
          ${this.totalPages}
        </span>
        
        <button 
          @click=${() => this.handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
        >
          ${LocalizationService.getTranslation('pagination.next')}
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);

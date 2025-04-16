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

    .pagination-container {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-button {
      padding: 8px;
      min-width: 32px;
      font-size: 16px;
      line-height: 1;
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
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    pages.push(1);

    let startPage = Math.max(2, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages - 1, this.currentPage + halfVisible);

    if (this.currentPage <= halfVisible + 1) {
      endPage = Math.min(this.totalPages - 1, maxVisiblePages);
    }

    if (this.currentPage >= this.totalPages - halfVisible) {
      startPage = Math.max(2, this.totalPages - maxVisiblePages + 1);
    }

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < this.totalPages - 1) {
      pages.push('...');
    }

    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return html`
      <div class="pagination">
        <button 
          class="page-button nav-button"
          @click=${() => this.handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        
        <div class="pagination-container">
          ${pages.map(page => 
            page === '...' 
              ? html`<span class="ellipsis">...</span>`
              : html`
                <button 
                  class="page-button ${this.currentPage === page ? 'selected' : ''}"
                  @click=${() => this.handlePageChange(page)}
                >
                  ${page}
                </button>
              `
          )}
        </div>
        
        <button 
          class="page-button nav-button"
          @click=${() => this.handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);

import { LitElement, html, css } from 'lit-element';

class IconComponent extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      size: { type: Number },
      color: { type: String },
      position: { type: String }
    };
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .icon-left {
      margin-right: 8px;
    }

    .icon-right {
      margin-left: 8px;
    }
  `;

  constructor() {
    super();
    this.size = 24;
    this.color = 'currentColor';
    this.position = 'center';
  }

  getIconTemplate() {
    const icons = {
      edit: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>`,
      delete: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <path d="M3 6h18"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>`,
      list: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>`,
      table: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>`,
      back: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>`,
      add: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <path d="M12 4v16m8-8H4"/>
      </svg>`,
      search: html`<svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>`,
      'arrow-up': html`
        <svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      `,
      'arrow-down': html`
        <svg width=${this.size} height=${this.size} viewBox="0 0 24 24" fill="none" stroke=${this.color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      `
    };

    return icons[this.name] || html`<span>Icon not found</span>`;
  }

  render() {
    return html`
      <div class="icon ${this.position === 'left' ? 'icon-left' : this.position === 'right' ? 'icon-right' : ''}">
        ${this.getIconTemplate()}
      </div>
    `;
  }
}

customElements.define('icon-component', IconComponent); 
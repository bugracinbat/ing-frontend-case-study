import { LitElement, html, css } from 'lit-element';

class IconComponent extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      size: { type: Number },
      color: { type: String }
    };
  }

  static styles = css`
    :host {
      display: inline-block;
      line-height: 0;
    }
  `;

  constructor() {
    super();
    this.size = 24;
    this.color = 'currentColor';
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
      </svg>`
    };

    return icons[this.name] || html`<span>Icon not found</span>`;
  }

  render() {
    return html`${this.getIconTemplate()}`;
  }
}

customElements.define('icon-component', IconComponent); 
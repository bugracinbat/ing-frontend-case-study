import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import { LocalizationService } from '../services/localization.js';

class NavigationMenu extends LitElement {
  static get properties() {
    return {
      currentLanguage: { type: String }
    };
  }

  static styles = css`
    nav { 
      padding: 10px; 
      background: #fff; 
      box-shadow: 0 4px 6px #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-links {
      display: flex;
    }
    a { 
      margin-right: 20px; 
      color: #ff6200; 
      text-decoration: none; 
      cursor: pointer; 
    }
    .language-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .language-button {
      padding: 4px 8px;
      border: 1px solid #ff6200;
      border-radius: 4px;
      background: transparent;
      color: #ff6200;
      cursor: pointer;
      font-size: 14px;
    }
    .language-button.active {
      background: #ff6200;
      color: white;
    }
  `;

  constructor() {
    super();
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

  changeLanguage(lang) {
    LocalizationService.setLanguage(lang);
  }

  render() {
    return html`
      <nav>
        <div class="nav-links">
          <a @click=${() => Router.go('/')}>
            ${LocalizationService.getTranslation('navigation.list')}
          </a>
          <a @click=${() => Router.go('/add')}>
            ${LocalizationService.getTranslation('navigation.add')}
          </a>
        </div>
        <div class="language-toggle">
          ${LocalizationService.getAvailableLanguages().map(lang => html`
            <button 
              class="language-button ${this.currentLanguage === lang ? 'active' : ''}"
              @click=${() => this.changeLanguage(lang)}
            >
              ${lang.toUpperCase()}
            </button>
          `)}
        </div>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);

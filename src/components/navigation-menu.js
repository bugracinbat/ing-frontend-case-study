import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import { LocalizationService } from '../services/localization.js';

class NavigationMenu extends LitElement {
  static get properties() {
    return {
      currentLanguage: { type: String },
      currentPath: { type: String }
    };
  }

  static styles = css`
    nav { 
      padding: 10px 20px; 
      background: #fff; 
      box-shadow: 0 4px 6px #ddd;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .nav-links {
      display: flex;
      margin-left: auto;
    }
    a { 
      margin-left: 20px; 
      color: #ff6200; 
      text-decoration: none; 
      cursor: pointer; 
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    a:hover {
      background: rgba(255, 98, 0, 0.1);
    }
    a.active {
      background: #ff6200;
      color: white;
    }
    .language-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 20px;
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

    @media (max-width: 768px) {
      nav {
        padding: 10px;
      }
      .nav-links {
        display: none;
      }
      .language-toggle {
        margin-left: auto;
      }
    }
  `;

  constructor() {
    super();
    this.currentLanguage = LocalizationService.getCurrentLanguage();
    this.currentPath = window.location.pathname;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange);
    window.addEventListener('popstate', this.handleRouteChange);
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.handleLanguageChange);
    window.removeEventListener('popstate', this.handleRouteChange);
    super.disconnectedCallback();
  }

  handleRouteChange = () => {
    this.currentPath = window.location.pathname;
    this.requestUpdate();
  }

  handleLanguageChange = (e) => {
    this.currentLanguage = e.detail.language;
    this.requestUpdate();
  }

  changeLanguage(lang) {
    LocalizationService.setLanguage(lang);
  }

  isActive(path) {
    return this.currentPath === path;
  }

  render() {
    return html`
      <nav>
        <div class="nav-links">
          <a 
            @click=${() => Router.go('/')}
            class=${this.isActive('/') ? 'active' : ''}
          >
            ${LocalizationService.getTranslation('navigation.list')}
          </a>
          <a 
            @click=${() => Router.go('/add')}
            class=${this.isActive('/add') ? 'active' : ''}
          >
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

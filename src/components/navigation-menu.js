import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import { LocalizationService } from '../services/localization.js';

class NavigationMenu extends LitElement {
  static get properties() {
    return {
      currentLanguage: { type: String },
      currentPath: { type: String },
      isMenuOpen: { type: Boolean }
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

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      cursor: pointer;
      margin-right: auto;
    }

    .hamburger span {
      display: block;
      height: 3px;
      width: 100%;
      background-color: #ff6200;
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    .mobile-menu {
      display: none;
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background: white;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 999;
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-menu a {
      display: block;
      margin: 10px 0;
      padding: 10px;
      text-align: center;
    }

    @media (max-width: 768px) {
      nav {
        padding: 10px;
      }
      .nav-links {
        display: none;
      }
      .hamburger {
        display: flex;
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
    this.isMenuOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange);
    window.addEventListener('popstate', this.handleRouteChange);
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.handleLanguageChange);
    window.removeEventListener('popstate', this.handleRouteChange);
    window.removeEventListener('resize', this.handleResize);
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

  handleResize = () => {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.isMenuOpen = false;
      this.requestUpdate();
    }
  }

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
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
        <div class="hamburger" @click=${this.toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
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
      <div class="mobile-menu ${this.isMenuOpen ? 'open' : ''}">
        <a 
          @click=${() => {
            Router.go('/');
            this.isMenuOpen = false;
          }}
          class=${this.isActive('/') ? 'active' : ''}
        >
          ${LocalizationService.getTranslation('navigation.list')}
        </a>
        <a 
          @click=${() => {
            Router.go('/add');
            this.isMenuOpen = false;
          }}
          class=${this.isActive('/add') ? 'active' : ''}
        >
          ${LocalizationService.getTranslation('navigation.add')}
        </a>
      </div>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);

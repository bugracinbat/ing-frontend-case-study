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
      padding: 0 1.5rem;
      height: 64px;
      background: var(--surface);
      box-shadow: var(--shadow-sm);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      border-bottom: 1px solid var(--border-color);
    }

    .nav-links {
      display: flex;
      margin-left: auto;
      gap: 1rem;
    }

    a { 
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      cursor: pointer;
    }

    a:hover {
      color: var(--primary-color);
      background: rgba(255, 98, 0, 0.05);
    }

    a.active {
      color: var(--primary-color);
      background: rgba(255, 98, 0, 0.1);
    }

    .language-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 1.5rem;
    }

    .language-button {
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .language-button:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .language-button.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin-right: auto;
    }

    .hamburger span {
      display: block;
      height: 2px;
      width: 100%;
      background-color: var(--text-secondary);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .mobile-menu {
      display: none;
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--surface);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      z-index: 999;
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-menu a {
      display: block;
      margin: 0.5rem 0;
      padding: 0.75rem;
      text-align: left;
    }

    @media (max-width: 768px) {
      nav {
        padding: 0 1rem;
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
            <icon-component name="add" size="20"></icon-component>
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

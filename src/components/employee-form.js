import { LitElement, html, css } from 'lit-element';
import { store } from '../state/store.js';
import { addEmployee, editEmployee } from '../state/store.js';
import { v4 as uuidv4 } from 'uuid';
import { LocalizationService } from '../services/localization.js';
import { Router } from '@vaadin/router';
import './icon-component.js';

class EmployeeForm extends LitElement {
  static get properties() {
    return {
      employee: { type: Object },
      isEditMode: { type: Boolean },
      params: { type: Object },
      currentLanguage: { type: String }
    };
  }

  static styles = css`
    .container {
      max-width: 600px;
      margin: 5rem auto 2rem;
      padding: 2rem;
      background-color: var(--surface);
      box-shadow: var(--shadow-md);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      margin-bottom: 1.5rem;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      cursor: pointer;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .back-button:hover {
      background: var(--surface);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.875rem;
    }

    input, select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      box-sizing: border-box;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: var(--surface);
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    input::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }

    button[type="submit"] {
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      margin-top: 1rem;
    }

    button[type="submit"]:hover {
      background: var(--primary-hover);
    }

    button[type="submit"]:active {
      transform: translateY(1px);
    }

    @media (max-width: 768px) {
      .container {
        margin: 4rem 1rem 1rem;
        padding: 1.5rem;
      }

      h1 {
        font-size: 1.25rem;
      }

      .back-button {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
      }

      input, select {
        padding: 0.625rem 0.875rem;
      }

      button[type="submit"] {
        padding: 0.625rem 1.25rem;
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .container {
        margin: 3.5rem 0.75rem 0.75rem;
        padding: 1.25rem;
      }

      h1 {
        font-size: 1.125rem;
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      label {
        font-size: 0.75rem;
      }

      input, select {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
      }
    }
  `;

  constructor() {
    super();
    this.isEditMode = false;
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this.currentLanguage = LocalizationService.getCurrentLanguage();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange);
    
    // Handle edit mode by checking for route params
    const url = new URL(window.location.href);
    const match = url.pathname.match(/\/edit\/(.+)/);
    const editId = match?.[1];

    if (editId) {
      const state = store.getState();
      const existing = state.employees.find(e => e.id === editId);
      if (existing) {
        this.employee = { ...existing };
        this.isEditMode = true;
      }
    }
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.handleLanguageChange);
    super.disconnectedCallback();
  }

  handleLanguageChange = (e) => {
    this.currentLanguage = e.detail.language;
    this.requestUpdate();
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = Object.fromEntries(formData);

    if (!this.validate(updated)) return;

    if (this.isEditMode) {
      store.dispatch(editEmployee({ ...updated, id: this.employee.id }));
    } else {
      store.dispatch(addEmployee({ ...updated, id: uuidv4() }));
    }

    Router.go('/');
  }

  validate(data) {
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
      alert('Invalid phone number format.');
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      alert('Invalid email address.');
      return false;
    }

    return true;
  }

  render() {
    return html`
      <div class="container">
        <a href="/" class="back-button">
          <icon-component name="back" size="16" position="left"></icon-component>
          ${LocalizationService.getTranslation('employeeForm.back')}
        </a>

        <h1>${this.isEditMode ? LocalizationService.getTranslation('employeeForm.editTitle') : LocalizationService.getTranslation('employeeForm.addTitle')}</h1>

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.firstName')}</label>
            <input 
              type="text" 
              name="firstName" 
              required
              .value=${this.employee?.firstName || ''}
              placeholder=${LocalizationService.getTranslation('employeeForm.firstNamePlaceholder')}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.lastName')}</label>
            <input 
              type="text" 
              name="lastName" 
              required
              .value=${this.employee?.lastName || ''}
              placeholder=${LocalizationService.getTranslation('employeeForm.lastNamePlaceholder')}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.dateOfEmployment')}</label>
            <input 
              type="date" 
              name="dateOfEmployment" 
              required
              .value=${this.employee?.dateOfEmployment || ''}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.dateOfBirth')}</label>
            <input 
              type="date" 
              name="dateOfBirth" 
              required
              .value=${this.employee?.dateOfBirth || ''}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.phoneNumber')}</label>
            <input 
              type="tel" 
              name="phoneNumber" 
              required
              .value=${this.employee?.phoneNumber || ''}
              placeholder=${LocalizationService.getTranslation('employeeForm.phoneNumberPlaceholder')}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.email')}</label>
            <input 
              type="email" 
              name="email" 
              required
              .value=${this.employee?.email || ''}
              placeholder=${LocalizationService.getTranslation('employeeForm.emailPlaceholder')}
            >
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.department')}</label>
            <select name="department" required>
              <option value="">${LocalizationService.getTranslation('employeeForm.selectDepartment')}</option>
              <option value="Analytics" ?selected=${this.employee?.department === 'Analytics'}>
                ${LocalizationService.getTranslation('employeeForm.analytics')}
              </option>
              <option value="Tech" ?selected=${this.employee?.department === 'Tech'}>
                ${LocalizationService.getTranslation('employeeForm.tech')}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.position')}</label>
            <select name="position" required>
              <option value="">${LocalizationService.getTranslation('employeeForm.selectPosition')}</option>
              <option value="Junior" ?selected=${this.employee?.position === 'Junior'}>
                ${LocalizationService.getTranslation('employeeForm.junior')}
              </option>
              <option value="Medior" ?selected=${this.employee?.position === 'Medior'}>
                ${LocalizationService.getTranslation('employeeForm.medior')}
              </option>
              <option value="Senior" ?selected=${this.employee?.position === 'Senior'}>
                ${LocalizationService.getTranslation('employeeForm.senior')}
              </option>
            </select>
          </div>

          <button type="submit">
            ${this.isEditMode ? LocalizationService.getTranslation('employeeForm.update') : LocalizationService.getTranslation('employeeForm.save')}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);

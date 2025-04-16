import { LitElement, html, css } from 'lit-element';
import { store } from '../state/store.js';
import { addEmployee, editEmployee } from '../state/store.js';
import { v4 as uuidv4 } from 'uuid';
import { LocalizationService } from '../services/localization.js';
import { Router } from '@vaadin/router';

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
      margin: 80px auto 20px;
      padding: 24px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
    }

    h1 {
      color: #ff6200;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 600;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      margin-bottom: 16px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      color: #333;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      background: #e0e0e0;
      transform: translateX(-2px);
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #666;
      font-weight: 500;
      font-size: 14px;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    input::placeholder {
      color: #999;
    }

    button[type="submit"] {
      background: #ff6200;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.2s ease;
      margin-top: 8px;
    }

    button[type="submit"]:hover {
      background: #e55a00;
    }

    button[type="submit"]:active {
      transform: translateY(1px);
    }

    @media (max-width: 768px) {
      .container {
        margin: 60px 16px 20px;
        padding: 20px;
      }

      h1 {
        font-size: 20px;
      }

      .back-button {
        padding: 8px 12px;
        font-size: 14px;
      }

      input, select {
        padding: 10px;
      }

      button[type="submit"] {
        padding: 10px 20px;
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .container {
        margin: 50px 12px 16px;
        padding: 16px;
      }

      h1 {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      label {
        font-size: 13px;
      }

      input, select {
        padding: 8px;
        font-size: 13px;
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          ${LocalizationService.getTranslation('employeeForm.back')}
        </a>
        <h1>${this.isEditMode 
          ? LocalizationService.getTranslation('employeeForm.editTitle')
          : LocalizationService.getTranslation('employeeForm.addTitle')}
        </h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.firstName')}</label>
            <input 
              name="firstName" 
              .value=${this.employee.firstName} 
              required 
              placeholder=${LocalizationService.getTranslation('employeeForm.firstNamePlaceholder')}
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.lastName')}</label>
            <input 
              name="lastName" 
              .value=${this.employee.lastName} 
              required 
              placeholder=${LocalizationService.getTranslation('employeeForm.lastNamePlaceholder')}
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.dateOfEmployment')}</label>
            <input 
              name="dateOfEmployment" 
              type="date" 
              .value=${this.employee.dateOfEmployment} 
              required 
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.dateOfBirth')}</label>
            <input 
              name="dateOfBirth" 
              type="date" 
              .value=${this.employee.dateOfBirth} 
              required 
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.phoneNumber')}</label>
            <input 
              name="phoneNumber" 
              .value=${this.employee.phoneNumber} 
              required 
              placeholder=${LocalizationService.getTranslation('employeeForm.phoneNumberPlaceholder')}
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.email')}</label>
            <input 
              name="email" 
              type="email" 
              .value=${this.employee.email} 
              required 
              placeholder=${LocalizationService.getTranslation('employeeForm.emailPlaceholder')}
            />
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.department')}</label>
            <select name="department" .value=${this.employee.department}>
              <option value="Analytics">${LocalizationService.getTranslation('employeeForm.analytics')}</option>
              <option value="Tech">${LocalizationService.getTranslation('employeeForm.tech')}</option>
            </select>
          </div>

          <div class="form-group">
            <label>${LocalizationService.getTranslation('employeeForm.position')}</label>
            <select name="position" .value=${this.employee.position}>
              <option value="Junior">${LocalizationService.getTranslation('employeeForm.junior')}</option>
              <option value="Medior">${LocalizationService.getTranslation('employeeForm.medior')}</option>
              <option value="Senior">${LocalizationService.getTranslation('employeeForm.senior')}</option>
            </select>
          </div>

          <button type="submit">
            ${this.isEditMode ? 
              LocalizationService.getTranslation('employeeForm.update') : 
              LocalizationService.getTranslation('employeeForm.save')}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);

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
        <div class="header">
          <a href="/" class="back-button">
            <icon-component name="back" size="24"></icon-component>
          </a>
          <h1>${this.isEditMode ? LocalizationService.getTranslation('employeeForm.editTitle') : LocalizationService.getTranslation('employeeForm.addTitle')}</h1>
        </div>

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="firstName">${LocalizationService.getTranslation('employeeForm.firstName')}</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              .value=${this.employee.firstName}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="lastName">${LocalizationService.getTranslation('employeeForm.lastName')}</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              .value=${this.employee.lastName}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="email">${LocalizationService.getTranslation('employeeForm.email')}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              .value=${this.employee.email}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="dateOfEmployment">${LocalizationService.getTranslation('employeeForm.dateOfEmployment')}</label>
            <input 
              type="date" 
              id="dateOfEmployment" 
              name="dateOfEmployment" 
              .value=${this.employee.dateOfEmployment}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="dateOfBirth">${LocalizationService.getTranslation('employeeForm.dateOfBirth')}</label>
            <input 
              type="date" 
              id="dateOfBirth" 
              name="dateOfBirth" 
              .value=${this.employee.dateOfBirth}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="phoneNumber">${LocalizationService.getTranslation('employeeForm.phoneNumber')}</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber" 
              .value=${this.employee.phoneNumber}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="department">${LocalizationService.getTranslation('employeeForm.department')}</label>
            <input 
              type="text" 
              id="department" 
              name="department" 
              .value=${this.employee.department}
              @input=${this.handleInput}
              required
            >
          </div>

          <div class="form-group">
            <label for="position">${LocalizationService.getTranslation('employeeForm.position')}</label>
            <input 
              type="text" 
              id="position" 
              name="position" 
              .value=${this.employee.position}
              @input=${this.handleInput}
              required
            >
          </div>

          <button type="submit" class="submit-button">
            ${this.isEditMode ? LocalizationService.getTranslation('employeeForm.updateButton') : LocalizationService.getTranslation('employeeForm.addButton')}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);

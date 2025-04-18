import { LitElement, html, css } from 'lit-element';
import { store } from '../state/store.js';
import { deleteEmployee } from '../state/store.js';
import './confirm-dialog.js';
import './pagination-component.js';
import { LocalizationService } from '../services/localization.js';
import './icon-component.js';

class EmployeeList extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      currentPage: { type: Number },
      employeesPerPage: { type: Number },
      searchQuery: { type: String },
      currentLanguage: { type: String },
      viewMode: { type: String } // 'table' or 'list'
    };
  }

  static styles = css`
    .container {
      max-width: 1200px;
      margin: 80px auto 20px;
      padding: 16px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
    }

    h1 {
      color: #ff6200;
      margin-bottom: 24px;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      justify-content: flex-end;
    }

    .view-toggle button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .view-toggle button.active {
      background: #ff6200;
      color: white;
      border-color: #ff6200;
    }

    .view-toggle button:hover {
      background: #f5f5f5;
    }

    .view-toggle button.active:hover {
      background: #e55a00;
    }

    input {
      padding: 8px;
      width: 100%;
      margin-bottom: 16px;
      box-sizing: border-box;
    }

    /* Table View Styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }

    th, td {
      padding: 12px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      color: #ff6200;
      font-weight: bold;
    }

    /* List View Styles */
    .list-view {
      display: grid;
      gap: 16px;
    }

    .list-item {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
    }

    .list-item-content {
      display: grid;
      gap: 8px;
    }

    .list-item-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 8px;
    }

    .list-item-field-label {
      font-weight: bold;
      color: #ff6200;
    }

    .actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }

    .action-button {
      padding: 4px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-button:hover {
      color: #ff6200;
    }

    .edit-button {
      color: #007bff;
    }

    .delete-button {
      color: #dc3545;
    }

    .edit-button:hover {
      color: #0056b3;
    }

    .delete-button:hover {
      color: #c82333;
    }

    /* Pagination Styles */
    pagination-component {
      --pagination-selected-bg: #ff6200;
      --pagination-selected-color: white;
    }

    @media (max-width: 768px) {
      .container {
        padding: 8px;
      }

      .list-item {
        grid-template-columns: 1fr;
      }

      .list-item-field {
        grid-template-columns: 1fr;
      }

      .list-item-field-label {
        margin-bottom: 4px;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.employeesPerPage = 10;
    this.searchQuery = '';
    this.currentLanguage = LocalizationService.getCurrentLanguage();
    this.viewMode = 'table'; // Default to table view

    // Initial state
    const initialState = store.getState();
    this.employees = Array.isArray(initialState.employees) ? initialState.employees : [];

    // Subscribe to store updates
    this.unsubscribe = store.subscribe(() => {
      const newState = store.getState();
      const newEmployees = Array.isArray(newState.employees) ? newState.employees : [];
      if (JSON.stringify(this.employees) !== JSON.stringify(newEmployees)) {
        this.employees = newEmployees;
        this.requestUpdate();
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this.handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener('language-changed', this.handleLanguageChange);
  }

  handleLanguageChange = (e) => {
    this.currentLanguage = e.detail.language;
    this.requestUpdate();
  }

  get filteredEmployees() {
    if (!Array.isArray(this.employees)) {
      return [];
    }
    const query = this.searchQuery.toLowerCase();
    return this.employees.filter(emp =>
      `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(query)
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.employeesPerPage);
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.employeesPerPage;
    return this.filteredEmployees.slice(start, start + this.employeesPerPage);
  }

  handleDelete(id) {
    const employee = this.employees.find(emp => emp.id === id);
    this.shadowRoot.querySelector('confirm-dialog').open({
      title: LocalizationService.getTranslation('dialog.title'),
      message: `${LocalizationService.getTranslation('dialog.message')} ${employee.firstName} ${employee.lastName} ${LocalizationService.getTranslation('dialog.willBeDeleted')}`,
      onConfirm: () => {
        store.dispatch(deleteEmployee(id));
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      },
    });
  }

  handlePageChange(e) {
    this.currentPage = e.detail;
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.currentPage = 1;
  }

  handleViewModeChange(mode) {
    this.viewMode = mode;
  }

  renderTableView() {
    return html`
      <table>
        <thead>
          <tr>
            <th>${LocalizationService.getTranslation('employeeList.firstName')}</th>
            <th>${LocalizationService.getTranslation('employeeList.lastName')}</th>
            <th>${LocalizationService.getTranslation('employeeList.email')}</th>
            <th>${LocalizationService.getTranslation('employeeList.dateOfEmployment')}</th>
            <th>${LocalizationService.getTranslation('employeeList.dateOfBirth')}</th>
            <th>${LocalizationService.getTranslation('employeeList.phoneNumber')}</th>
            <th>${LocalizationService.getTranslation('employeeList.department')}</th>
            <th>${LocalizationService.getTranslation('employeeList.position')}</th>
            <th>${LocalizationService.getTranslation('employeeList.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.map(emp => html`
            <tr>
              <td>${emp.firstName}</td>
              <td>${emp.lastName}</td>
              <td>${emp.dateOfEmployment}</td>
              <td>${emp.dateOfBirth}</td>
              <td>${emp.phoneNumber}</td>
              <td>${emp.email}</td>
              <td>${emp.department}</td>
              <td>${emp.position}</td>
              <td>
                <div class="actions">
                  <a href="/edit/${emp.id}" class="action-button edit-button">
                    <icon-component name="edit" size="20"></icon-component>
                  </a>
                  <button class="action-button delete-button" @click=${() => this.handleDelete(emp.id)}>
                    <icon-component name="delete" size="20"></icon-component>
                  </button>
                </div>
              </td>
            </tr>
          `)}
          ${this.paginatedEmployees.length === 0 ? html`
            <tr>
              <td colspan="6">${LocalizationService.getTranslation('employeeList.noRecords')}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>
    `;
  }

  renderListView() {
    return html`
      <div class="list-view">
        ${this.paginatedEmployees.map(emp => html`
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.firstName')}:</span>
                <span>${emp.firstName}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.lastName')}:</span>
                <span>${emp.lastName}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.dateOfEmployment')}:</span>
                <span>${emp.dateOfEmployment}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.dateOfBirth')}:</span>
                <span>${emp.dateOfBirth}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.phoneNumber')}:</span>
                <span>${emp.phoneNumber}</span>
              </div>

              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.email')}:</span>
                <span>${emp.email}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.department')}:</span>
                <span>${emp.department}</span>
              </div>
              <div class="list-item-field">
                <span class="list-item-field-label">${LocalizationService.getTranslation('employeeList.position')}:</span>
                <span>${emp.position}</span>
              </div>
            </div>
            <div class="actions">
              <a href="/edit/${emp.id}" class="action-button edit-button">
                <icon-component name="edit" size="20"></icon-component>
              </a>
              <button class="action-button delete-button" @click=${() => this.handleDelete(emp.id)}>
                <icon-component name="delete" size="20"></icon-component>
              </button>
            </div>
          </div>
        `)}
        ${this.paginatedEmployees.length === 0 ? html`
          <div class="list-item">
            ${LocalizationService.getTranslation('employeeList.noRecords')}
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    return html`
      <div class="container">
        <h1>${LocalizationService.getTranslation('employeeList.title')}</h1>
        
        <div class="view-toggle">
          <button 
            class=${this.viewMode === 'list' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('list')}
            title=${LocalizationService.getTranslation('employeeList.listView')}
          >
            <icon-component name="list" size="16"></icon-component>
          </button>
          <button 
            class=${this.viewMode === 'table' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('table')}
            title=${LocalizationService.getTranslation('employeeList.tableView')}
          >
            <icon-component name="table" size="16"></icon-component>
          </button>
        </div>

        <input 
          type="text" 
          placeholder=${LocalizationService.getTranslation('employeeList.searchPlaceholder')} 
          @input=${this.handleSearch} 
        />

        ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}

        <pagination-component
          .currentPage=${this.currentPage}
          .totalPages=${this.totalPages}
          @page-changed=${this.handlePageChange}>
        </pagination-component>

        <confirm-dialog></confirm-dialog>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);

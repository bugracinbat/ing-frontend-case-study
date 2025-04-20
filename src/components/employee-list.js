import { LitElement, html, css } from 'lit-element';
import { store } from '../state/store.js';
import { deleteEmployee, editEmployee } from '../state/store.js';
import './confirm-dialog.js';
import './pagination-component.js';
import { LocalizationService } from '../services/localization.js';
import './icon-component.js';
import { Router } from '@vaadin/router';

class EmployeeList extends LitElement {
  static get properties() {
    return {
      employees: { type: Array },
      currentPage: { type: Number },
      employeesPerPage: { type: Number },
      searchQuery: { type: String },
      currentLanguage: { type: String },
      viewMode: { type: String },
      sortColumn: { type: String },
      sortDirection: { type: String },
      selectedEmployees: { type: Array },
      editingEmployee: { type: Object }
    };
  }

  static styles = css`
    .container {
      max-width: 1600px;
      margin: 5rem auto 2rem;
      padding: 1.5rem;
      background-color: var(--surface);
      box-shadow: var(--shadow-md);
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      width: 100%;
      box-sizing: border-box;
    }

    .content-wrapper {
      width: 100%;
      overflow-x: auto;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h1 {
      color: var(--primary-color);
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .search-container {
      width: 100%;
      position: relative;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: var(--surface);
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      pointer-events: none;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
      margin-left: auto;
    }

    .view-toggle button {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      background: var(--surface);
      cursor: pointer;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      height: 2.5rem;
      transition: all 0.2s ease;
    }

    .view-toggle button:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .view-toggle button.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin-bottom: 1.5rem;
      -webkit-overflow-scrolling: touch;
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
      background: var(--surface);
      box-sizing: border-box;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1200px;
      box-sizing: border-box;
    }

    th, td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      text-align: center;
      white-space: nowrap;
      font-size: 0.875rem;
      vertical-align: middle;
      height: 48px;
    }

    th {
      background-color: var(--background);
      color: var(--text-secondary);
      font-weight: 500;
      position: sticky;
      top: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.75rem;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      text-align: center;
      padding: 1rem;
    }

    th:hover {
      background-color: var(--background-hover);
    }

    .sortable {
      position: relative;
      padding-right: 1.5rem;
    }

    .sort-icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background-color: var(--background);
    }

    .list-view {
      display: grid;
      gap: 1rem;
    }

    .list-item {
      padding: 1.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      transition: all 0.2s ease;
      background: var(--surface);
    }

    .list-item:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }

    .list-item-content {
      display: grid;
      gap: 0.75rem;
    }

    .list-item-field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 0.75rem;
      align-items: center;
    }

    .list-item-field-label {
      font-weight: 500;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
      min-width: 120px;
      transform: translateY(-1px);
    }

    .action-button {
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
      min-width: 32px;
      height: 32px;
      transform: translateY(-1px);
    }

    .action-button:hover {
      color: var(--primary-color);
      background: rgba(255, 98, 0, 0.05);
      transform: scale(1.1);
    }

    .edit-button {
      color: #007bff;
    }

    .delete-button {
      color: #dc3545;
    }

    .edit-button:hover {
      color: #0056b3;
      background: rgba(0, 123, 255, 0.05);
    }

    .delete-button:hover {
      color: #c82333;
      background: rgba(220, 53, 69, 0.05);
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    .bulk-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background-color: var(--background);
      border-radius: 0.375rem;
      border: 1px solid var(--border-color);
      width: 100%;
      box-sizing: border-box;
    }

    .bulk-actions.hidden {
      display: none;
    }

    .select-all-checkbox {
      margin-right: 0.5rem;
    }

    .bulk-delete-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .bulk-delete-button:hover {
      background-color: var(--primary-hover);
    }

    .bulk-delete-button:disabled {
      background-color: var(--text-disabled);
      cursor: not-allowed;
    }

    .selected-count {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
        margin: 4rem 1rem 1rem;
      }

      .content-wrapper {
        margin: 0;
        padding: 0;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .search-container {
        min-width: 100%;
        max-width: 100%;
      }

      .view-toggle {
        margin-left: 0;
        justify-content: flex-end;
      }

      .table-container {
        margin: 0 -1rem;
        padding: 0 1rem;
      }

      th, td {
        padding: 0.75rem;
      }

      .list-item {
        grid-template-columns: 1fr;
      }

      .list-item-field {
        grid-template-columns: 1fr;
      }

      .list-item-field-label {
        margin-bottom: 0.25rem;
      }
    }

    .editable-cell {
      position: relative;
      padding-right: 2rem;
    }

    .editable-cell:hover .edit-icon {
      opacity: 1;
    }

    .edit-icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.2s ease;
      cursor: pointer;
      color: var(--primary-color);
      padding: 0.25rem;
      border-radius: 0.25rem;
    }

    .edit-icon:hover {
      opacity: 1;
      background: var(--background);
    }

    .edit-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      background: var(--surface);
    }

    .edit-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .edit-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
      min-width: 120px;
      transform: translateY(-1px);
    }

    .edit-button {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
      transform: translateY(-1px);
    }

    .save-button {
      background-color: var(--primary-color);
      color: white;
    }

    .cancel-button {
      background-color: var(--background);
      color: var(--text-secondary);
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.employeesPerPage = 10;
    this.searchQuery = '';
    this.currentLanguage = LocalizationService.getCurrentLanguage();
    this.viewMode = 'table';
    this.sortColumn = 'firstName';
    this.sortDirection = 'asc';
    this.selectedEmployees = [];
    this.editingEmployee = null;

    this.updateViewMode();

    const initialState = store.getState();
    this.employees = Array.isArray(initialState.employees) ? initialState.employees : [];

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
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('language-changed', this.handleLanguageChange);
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleResize = () => {
    this.updateViewMode();
  }

  updateViewMode = () => {
    const isMobile = window.innerWidth <= 768;
    this.viewMode = isMobile ? 'list' : 'table';
    this.requestUpdate();
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

  handleSort(column) {
    if (this.sortColumn === column) {
      if (this.sortDirection === 'desc') {
        this.sortColumn = 'firstName';
        this.sortDirection = 'asc';
      } else {
        this.sortDirection = 'desc';
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get sortedEmployees() {
    const sorted = [...this.filteredEmployees];
    sorted.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      
      if (typeof aValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return this.sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });
    
    return sorted;
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.employeesPerPage;
    return this.sortedEmployees.slice(start, start + this.employeesPerPage);
  }

  renderSortIcon(column) {
    if (this.sortColumn !== column) return '';
    
    return html`
      <span class="sort-icon">
        <icon-component name=${this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size="12"></icon-component>
      </span>
    `;
  }

  handleEdit(id) {
    Router.go(`/edit/${id}`);
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

  handleSelectAll(e) {
    const isChecked = e.target.checked;
    if (isChecked) {
      this.selectedEmployees = [...this.paginatedEmployees.map(emp => emp.id)];
    } else {
      this.selectedEmployees = [];
    }
  }

  handleSelectEmployee(e, employeeId) {
    const isChecked = e.target.checked;
    if (isChecked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(id => id !== employeeId);
    }
  }

  handleBulkDelete() {
    if (this.selectedEmployees.length === 0) return;

    this.shadowRoot.querySelector('confirm-dialog').open({
      title: LocalizationService.getTranslation('dialog.title'),
      message: `${LocalizationService.getTranslation('dialog.message')} ${this.selectedEmployees.length} ${LocalizationService.getTranslation('dialog.employees')}`,
      onConfirm: () => {
        this.selectedEmployees.forEach(id => {
          store.dispatch(deleteEmployee(id));
        });
        this.selectedEmployees = [];
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      },
    });
  }

  handleEditClick(employee) {
    this.editingEmployee = { ...employee };
  }

  handleEditCancel() {
    this.editingEmployee = null;
  }

  handleEditSave() {
    if (this.editingEmployee) {
      store.dispatch(editEmployee(this.editingEmployee));
      this.editingEmployee = null;
    }
  }

  handleEditInput(field, value) {
    if (this.editingEmployee) {
      this.editingEmployee = {
        ...this.editingEmployee,
        [field]: value
      };
    }
  }

  renderEditableCell(employee, field) {
    if (this.editingEmployee?.id === employee.id) {
      return html`
        <input
          class="edit-input"
          type="text"
          .value=${this.editingEmployee[field]}
          @input=${(e) => this.handleEditInput(field, e.target.value)}
        />
      `;
    }

    return html`
      <div class="editable-cell">
        ${employee[field]}
        <span class="edit-icon" @click=${() => this.handleEditClick(employee)}>
          <icon-component name="edit" size="14"></icon-component>
        </span>
      </div>
    `;
  }

  renderActionsCell(employee) {
    if (this.editingEmployee?.id === employee.id) {
      return html`
        <td class="actions">
          <div class="edit-actions">
            <button class="edit-button save-button" @click=${this.handleEditSave}>
              <icon-component name="check" size="14"></icon-component>
              ${LocalizationService.getTranslation('employeeList.save')}
            </button>
            <button class="edit-button cancel-button" @click=${this.handleEditCancel}>
              <icon-component name="x" size="14"></icon-component>
              ${LocalizationService.getTranslation('employeeList.cancel')}
            </button>
          </div>
        </td>
      `;
    }

    return html`
      <td class="actions">
        <button class="action-button edit-button" @click=${() => this.handleEditClick(employee)}>
          <icon-component name="edit"></icon-component>
        </button>
        <button class="action-button delete-button" @click=${() => this.handleDelete(employee.id)}>
          <icon-component name="delete"></icon-component>
        </button>
      </td>
    `;
  }

  renderTableView() {
    if (this.filteredEmployees.length === 0) {
      return html`
        <div class="no-results">
          ${LocalizationService.getTranslation('employeeList.noRecords')}
        </div>
      `;
    }

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input 
                  type="checkbox" 
                  class="select-all-checkbox"
                  @change=${this.handleSelectAll}
                  ?checked=${this.selectedEmployees.length === this.paginatedEmployees.length && this.paginatedEmployees.length > 0}
                />
              </th>
              <th class="sortable" @click=${() => this.handleSort('firstName')}>
                ${LocalizationService.getTranslation('employeeList.firstName')}
                ${this.renderSortIcon('firstName')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('lastName')}>
                ${LocalizationService.getTranslation('employeeList.lastName')}
                ${this.renderSortIcon('lastName')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('dateOfEmployment')}>
                ${LocalizationService.getTranslation('employeeList.dateOfEmployment')}
                ${this.renderSortIcon('dateOfEmployment')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('dateOfBirth')}>
                ${LocalizationService.getTranslation('employeeList.dateOfBirth')}
                ${this.renderSortIcon('dateOfBirth')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('phoneNumber')}>
                ${LocalizationService.getTranslation('employeeList.phoneNumber')}
                ${this.renderSortIcon('phoneNumber')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('email')}>
                ${LocalizationService.getTranslation('employeeList.email')}
                ${this.renderSortIcon('email')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('department')}>
                ${LocalizationService.getTranslation('employeeList.department')}
                ${this.renderSortIcon('department')}
              </th>
              <th class="sortable" @click=${() => this.handleSort('position')}>
                ${LocalizationService.getTranslation('employeeList.position')}
                ${this.renderSortIcon('position')}
              </th>
              <th>${LocalizationService.getTranslation('employeeList.actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(employee => html`
              <tr>
                <td class="checkbox-cell">
                  <input 
                    type="checkbox" 
                    @change=${(e) => this.handleSelectEmployee(e, employee.id)}
                    ?checked=${this.selectedEmployees.includes(employee.id)}
                  />
                </td>
                <td>${this.renderEditableCell(employee, 'firstName')}</td>
                <td>${this.renderEditableCell(employee, 'lastName')}</td>
                <td>${this.renderEditableCell(employee, 'dateOfEmployment')}</td>
                <td>${this.renderEditableCell(employee, 'dateOfBirth')}</td>
                <td>${this.renderEditableCell(employee, 'phoneNumber')}</td>
                <td>${this.renderEditableCell(employee, 'email')}</td>
                <td>${this.renderEditableCell(employee, 'department')}</td>
                <td>${this.renderEditableCell(employee, 'position')}</td>
                ${this.renderActionsCell(employee)}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListView() {
    if (this.filteredEmployees.length === 0) {
      return html`
        <div class="no-results">
          ${LocalizationService.getTranslation('employeeList.noRecords')}
        </div>
      `;
    }

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
              <button class="action-button edit-button" @click=${() => this.handleEdit(emp.id)}>
                <icon-component name="edit"></icon-component>
              </button>
              <button class="action-button delete-button" @click=${() => this.handleDelete(emp.id)}>
                <icon-component name="delete"></icon-component>
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
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
        </div>

        <div class="content-wrapper">
          <div class="search-container">
            <input 
              type="text" 
              placeholder=${LocalizationService.getTranslation('employeeList.searchPlaceholder')} 
              @input=${this.handleSearch} 
              class="search-input"
            />
            <span class="search-icon">
              <icon-component name="search"></icon-component>
            </span>
          </div>

          ${this.viewMode === 'table' ? html`
            <div class="bulk-actions ${this.selectedEmployees.length === 0 ? 'hidden' : ''}">
              <span class="selected-count">
                ${this.selectedEmployees.length} ${LocalizationService.getTranslation('employeeList.selected')}
              </span>
              <button 
                class="bulk-delete-button" 
                @click=${this.handleBulkDelete}
                ?disabled=${this.selectedEmployees.length === 0}
              >
                <icon-component name="delete" size="16"></icon-component>
                ${LocalizationService.getTranslation('employeeList.delete')}
              </button>
            </div>
            ${this.renderTableView()}
          ` : this.renderListView()}
        </div>

        ${this.filteredEmployees.length > 0 ? html`
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @page-changed=${this.handlePageChange}>
          </pagination-component>
        ` : ''}

        <confirm-dialog></confirm-dialog>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);

import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/components/employee-list.js';
import { store } from '../src/state/store.js';
import { LocalizationService } from '../src/services/localization.js';

describe('EmployeeList', () => {
  let element;
  let unsubscribeStub;
  let storeSubscribeCallback;
  const mockEmployees = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      department: 'Analytics',
      position: 'Junior',
      dateOfEmployment: '2021-01-01',
      dateOfBirth: '1995-01-01'
    }
  ];

  beforeEach(async () => {
    // Stub store methods
    unsubscribeStub = sinon.stub();
    sinon.stub(store, 'subscribe').callsFake((callback) => {
      storeSubscribeCallback = callback;
      return unsubscribeStub;
    });
    sinon.stub(store, 'getState').returns({ employees: mockEmployees });

    // Stub LocalizationService
    sinon.stub(LocalizationService, 'getCurrentLanguage').returns('en');
    sinon.stub(LocalizationService, 'getTranslation').callsFake((key) => {
      const translations = {
        'employeeList.title': 'Employee List',
        'employeeList.searchPlaceholder': 'Search employees...',
        'employeeList.firstName': 'First Name',
        'employeeList.lastName': 'Last Name',
        'employeeList.email': 'Email',
        'employeeList.phoneNumber': 'Phone Number',
        'employeeList.department': 'Department',
        'employeeList.position': 'Position',
        'employeeList.dateOfEmployment': 'Date of Employment',
        'employeeList.dateOfBirth': 'Date of Birth',
        'employeeList.actions': 'Actions',
        'employeeList.edit': 'Edit',
        'employeeList.delete': 'Delete',
        'employeeList.tableView': 'Table View',
        'employeeList.listView': 'List View',
        'employeeList.noRecords': 'No records found'
      };
      return translations[key] || key;
    });

    element = await fixture(html`<employee-list></employee-list>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initializes with default values', () => {
    expect(element.employees).to.be.an('array');
    expect(element.currentPage).to.equal(1);
    expect(element.employeesPerPage).to.equal(10);
    expect(element.searchQuery).to.equal('');
    expect(element.viewMode).to.equal('table');
  });

  it('subscribes to store updates', () => {
    expect(store.subscribe.calledOnce).to.be.true;
  });

  it('unsubscribes from store on disconnect', () => {
    element.disconnectedCallback();
    expect(unsubscribeStub.calledOnce).to.be.true;
  });

  it('filters employees based on search query', async () => {
    element.searchQuery = 'John';
    await element.updateComplete;
    expect(element.filteredEmployees.length).to.equal(1);
    expect(element.filteredEmployees[0].firstName).to.equal('John');
  });

  it('calculates total pages correctly', async () => {
    element.employeesPerPage = 1;
    await element.updateComplete;
    expect(element.totalPages).to.equal(2);
  });

  it('paginates employees correctly', async () => {
    element.employeesPerPage = 1;
    element.currentPage = 2;
    await element.updateComplete;
    expect(element.paginatedEmployees.length).to.equal(1);
    expect(element.paginatedEmployees[0].firstName).to.equal('Jane');
  });

  it('switches between table and list view', async () => {
    element.viewMode = 'list';
    await element.updateComplete;
    const listView = element.shadowRoot.querySelector('.list-view');
    expect(listView).to.exist;

    element.viewMode = 'table';
    await element.updateComplete;
    const tableView = element.shadowRoot.querySelector('table');
    expect(tableView).to.exist;
  });

  it('renders employee data in table view', async () => {
    await element.updateComplete;
    const table = element.shadowRoot.querySelector('table');
    const headers = table.querySelectorAll('th');
    const firstRow = table.querySelector('tbody tr');
    const cells = firstRow.querySelectorAll('td');

    // Verify headers
    const expectedHeaders = [
      'First Name',
      'Last Name',
      'Email',
      'Date of Employment',
      'Date of Birth',
      'Phone Number',
      'Department',
      'Position',
      'Actions'
    ];

    const actualHeaders = Array.from(headers).map(header => header.textContent.trim());
    expectedHeaders.forEach(header => {
      expect(actualHeaders).to.include(header);
    });

    // Verify first row data
    expect(cells[0].textContent.trim()).to.equal('John');
    expect(cells[1].textContent.trim()).to.equal('Doe');
    expect(cells[2].textContent.trim()).to.equal('2020-01-01');
    expect(cells[3].textContent.trim()).to.equal('1990-01-01');
    expect(cells[4].textContent.trim()).to.equal('1234567890');
    expect(cells[5].textContent.trim()).to.equal('john@example.com');
    expect(cells[6].textContent.trim()).to.equal('Tech');
    expect(cells[7].textContent.trim()).to.equal('Senior');
  });

  it('renders employee data in list view', async () => {
    element.viewMode = 'list';
    await element.updateComplete;
    
    const listItems = element.shadowRoot.querySelectorAll('.list-item');
    expect(listItems.length).to.equal(2);
    
    const firstItem = listItems[0];
    expect(firstItem.textContent).to.include('John');
    expect(firstItem.textContent).to.include('Doe');
    expect(firstItem.textContent).to.include('john@example.com');
  });

  it('handles language changes', async () => {
    const event = new CustomEvent('language-changed', {
      detail: { language: 'tr' }
    });
    window.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element.currentLanguage).to.equal('tr');
  });

  it('updates when store state changes', async () => {
    const newEmployees = [
      {
        id: '3',
        firstName: 'New',
        lastName: 'Employee',
        email: 'new@example.com',
        phoneNumber: '5555555555',
        department: 'HR',
        position: 'Manager',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1985-01-01'
      }
    ];
    
    store.getState.returns({ employees: newEmployees });
    if (storeSubscribeCallback) {
      storeSubscribeCallback();
    }
    await element.updateComplete;
    
    const firstRow = element.shadowRoot.querySelector('tbody tr');
    const cells = firstRow.querySelectorAll('td');
    expect(cells[0].textContent.trim()).to.equal('New');
    expect(cells[1].textContent.trim()).to.equal('Employee');
    expect(cells[2].textContent.trim()).to.equal('2023-01-01');
  });

  it('handles empty employee list', async () => {
    store.getState.returns({ employees: [] });
    if (storeSubscribeCallback) {
      storeSubscribeCallback();
    }
    await element.updateComplete;
    
    const noRecordsRow = element.shadowRoot.querySelector('tbody tr td[colspan="6"]');
    expect(noRecordsRow.textContent.trim()).to.equal('No records found');
  });

  it('handles invalid employee data', async () => {
    store.getState.returns({ employees: null });
    if (storeSubscribeCallback) {
      storeSubscribeCallback();
    }
    await element.updateComplete;
    
    const noRecordsRow = element.shadowRoot.querySelector('tbody tr td[colspan="6"]');
    expect(noRecordsRow.textContent.trim()).to.equal('No records found');
  });
}); 
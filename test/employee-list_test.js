import { html, render } from 'lit-html';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import '../src/components/employee-list.js';
import { store } from '../src/state/store.js';
import { LocalizationService } from '../src/services/localization.js';

describe('EmployeeList', () => {
  let element;
  const mockEmployees = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'Tech', position: 'Senior' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', department: 'Analytics', position: 'Junior' }
  ];

  beforeEach(async () => {
    // Reset store state
    store.setState({ employees: mockEmployees });
    
    element = await fixture(html`<employee-list></employee-list>`);
    await elementUpdated(element);
  });

  it('renders the employee list title', () => {
    const title = element.shadowRoot.querySelector('h1');
    expect(title).to.exist;
    expect(title.textContent).to.equal(LocalizationService.getTranslation('employeeList.title'));
  });

  it('displays all employees in the table', () => {
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(mockEmployees.length);
  });

  it('filters employees based on search query', async () => {
    const searchInput = element.shadowRoot.querySelector('input');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('John');
  });

  it('handles pagination correctly', async () => {
    // Set items per page to 1
    element.employeesPerPage = 1;
    await elementUpdated(element);

    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);

    // Change page
    const pagination = element.shadowRoot.querySelector('pagination-component');
    pagination.dispatchEvent(new CustomEvent('page-changed', { detail: 2 }));
    await elementUpdated(element);

    const newRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(newRows.length).to.equal(1);
    expect(newRows[0].textContent).to.include('Jane');
  });

  it('switches between table and list views', async () => {
    // Default should be table view
    expect(element.shadowRoot.querySelector('table')).to.exist;
    expect(element.shadowRoot.querySelector('.list-view')).to.not.exist;

    // Switch to list view
    const listButton = element.shadowRoot.querySelectorAll('.view-toggle button')[1];
    listButton.click();
    await elementUpdated(element);

    expect(element.shadowRoot.querySelector('table')).to.not.exist;
    expect(element.shadowRoot.querySelector('.list-view')).to.exist;
  });

  it('dispatches delete action when delete button is clicked', async () => {
    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();

    const dialog = element.shadowRoot.querySelector('confirm-dialog');
    expect(dialog.isOpen).to.be.true;
  });

  it('updates when language changes', async () => {
    const originalTitle = element.shadowRoot.querySelector('h1').textContent;
    
    // Change language
    LocalizationService.setLanguage('tr');
    await elementUpdated(element);

    const newTitle = element.shadowRoot.querySelector('h1').textContent;
    expect(newTitle).to.not.equal(originalTitle);
  });
}); 
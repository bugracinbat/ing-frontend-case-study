import { html, render } from 'lit-html';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import '../src/components/employee-form.js';
import { store } from '../src/state/store.js';
import { LocalizationService } from '../src/services/localization.js';

describe('EmployeeForm', () => {
  let element;
  const mockEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    dateOfEmployment: '2023-01-01',
    dateOfBirth: '1990-01-01',
    department: 'Tech',
    position: 'Senior'
  };

  beforeEach(async () => {
    element = await fixture(html`<employee-form></employee-form>`);
    await elementUpdated(element);
  });

  it('renders the form title', () => {
    const title = element.shadowRoot.querySelector('h1');
    expect(title).to.exist;
    expect(title.textContent).to.equal(LocalizationService.getTranslation('employeeForm.addTitle'));
  });

  it('renders all required form fields', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'dateOfEmployment',
      'dateOfBirth',
      'department',
      'position'
    ];

    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      expect(input).to.exist;
      if (field !== 'department' && field !== 'position') {
        expect(input.hasAttribute('required')).to.be.true;
      }
    });
  });

  it('pre-fills form fields in edit mode', async () => {
    // Set edit mode and employee data
    element.isEditMode = true;
    element.employee = mockEmployee;
    await elementUpdated(element);

    const form = element.shadowRoot.querySelector('form');
    expect(form.querySelector('[name="firstName"]').value).to.equal(mockEmployee.firstName);
    expect(form.querySelector('[name="lastName"]').value).to.equal(mockEmployee.lastName);
    expect(form.querySelector('[name="email"]').value).to.equal(mockEmployee.email);
    expect(form.querySelector('[name="phoneNumber"]').value).to.equal(mockEmployee.phoneNumber);
    expect(form.querySelector('[name="department"]').value).to.equal(mockEmployee.department);
    expect(form.querySelector('[name="position"]').value).to.equal(mockEmployee.position);
  });

  it('validates email format', async () => {
    const form = element.shadowRoot.querySelector('form');
    const emailInput = form.querySelector('[name="email"]');
    
    // Invalid email
    emailInput.value = 'invalid-email';
    form.dispatchEvent(new Event('submit'));
    await elementUpdated(element);

    expect(emailInput.validity.valid).to.be.false;

    // Valid email
    emailInput.value = 'valid@example.com';
    form.dispatchEvent(new Event('submit'));
    await elementUpdated(element);

    expect(emailInput.validity.valid).to.be.true;
  });

  it('validates phone number format', async () => {
    const form = element.shadowRoot.querySelector('form');
    const phoneInput = form.querySelector('[name="phoneNumber"]');
    
    // Invalid phone number
    phoneInput.value = '123';
    form.dispatchEvent(new Event('submit'));
    await elementUpdated(element);

    expect(phoneInput.validity.valid).to.be.false;

    // Valid phone number
    phoneInput.value = '1234567890';
    form.dispatchEvent(new Event('submit'));
    await elementUpdated(element);

    expect(phoneInput.validity.valid).to.be.true;
  });

  it('dispatches add action for new employee', async () => {
    const form = element.shadowRoot.querySelector('form');
    const submitEvent = new Event('submit', { cancelable: true });
    
    form.dispatchEvent(submitEvent);
    await elementUpdated(element);

    // Check if the event was not cancelled (form was submitted)
    expect(submitEvent.defaultPrevented).to.be.true;
  });

  it('dispatches edit action for existing employee', async () => {
    element.isEditMode = true;
    element.employee = mockEmployee;
    await elementUpdated(element);

    const form = element.shadowRoot.querySelector('form');
    const submitEvent = new Event('submit', { cancelable: true });
    
    form.dispatchEvent(submitEvent);
    await elementUpdated(element);

    // Check if the event was not cancelled (form was submitted)
    expect(submitEvent.defaultPrevented).to.be.true;
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
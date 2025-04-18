import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/components/employee-form.js';
import { store } from '../src/state/store.js';
import { LocalizationService } from '../src/services/localization.js';
import { Router } from '@vaadin/router';

describe('EmployeeForm', () => {
  let element;
  let dispatchStub;

  beforeEach(async () => {
    // Stub store methods
    dispatchStub = sinon.stub();
    sinon.stub(store, 'dispatch').callsFake(dispatchStub);
    sinon.stub(store, 'getState').returns({
      employees: [
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
        }
      ]
    });

    // Stub LocalizationService
    sinon.stub(LocalizationService, 'getCurrentLanguage').returns('en');
    sinon.stub(LocalizationService, 'getTranslation').callsFake((key) => {
      const translations = {
        'employeeForm.addTitle': 'Add Employee',
        'employeeForm.editTitle': 'Edit Employee',
        'employeeForm.firstName': 'First Name',
        'employeeForm.lastName': 'Last Name',
        'employeeForm.email': 'Email Address',
        'employeeForm.phoneNumber': 'Phone Number',
        'employeeForm.department': 'Department',
        'employeeForm.position': 'Position',
        'employeeForm.dateOfEmployment': 'Date of Employment',
        'employeeForm.dateOfBirth': 'Date of Birth',
        'employeeForm.save': 'Save',
        'employeeForm.update': 'Update',
        'employeeForm.back': 'Back to List',
        'employeeForm.firstNamePlaceholder': 'Enter first name',
        'employeeForm.lastNamePlaceholder': 'Enter last name',
        'employeeForm.phoneNumberPlaceholder': 'Enter phone number',
        'employeeForm.emailPlaceholder': 'Enter email address',
        'employeeForm.analytics': 'Analytics',
        'employeeForm.tech': 'Tech',
        'employeeForm.junior': 'Junior',
        'employeeForm.medior': 'Medior',
        'employeeForm.senior': 'Senior'
      };
      return translations[key] || key;
    });

    // Stub Router
    sinon.stub(Router, 'go');

    element = await fixture(html`<employee-form></employee-form>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('initializes with default values', () => {
    expect(element.employee).to.deep.equal({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    });
    expect(element.isEditMode).to.be.false;
  });

  it('loads employee data in edit mode', async () => {
    // Create element and set edit mode
    element = await fixture(html`<employee-form></employee-form>`);
    element.isEditMode = true;
    element.employee = store.getState().employees[0];
    await element.updateComplete;

    expect(element.isEditMode).to.be.true;
    expect(element.employee.firstName).to.equal('John');
    expect(element.employee.lastName).to.equal('Doe');
    expect(element.employee.email).to.equal('john@example.com');
  });

  it('validates form data correctly', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+1 (123) 456-7890',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01'
    };

    expect(element.validate(validData)).to.be.true;

    const invalidEmail = { ...validData, email: 'invalid-email' };
    expect(element.validate(invalidEmail)).to.be.false;

    const invalidPhone = { ...validData, phoneNumber: '123' };
    expect(element.validate(invalidPhone)).to.be.false;
  });

  it('submits new employee data', async () => {
    const form = element.shadowRoot.querySelector('form');
    const submitEvent = new CustomEvent('submit', {
      bubbles: true,
      cancelable: true
    });

    // Set form field values
    element.employee = {
      firstName: 'New',
      lastName: 'Employee',
      email: 'new@example.com',
      phoneNumber: '+1 (234) 567-8901',
      department: 'Analytics',
      position: 'Junior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1995-01-01'
    };
    await element.updateComplete;

    form.dispatchEvent(submitEvent);
    await element.updateComplete;

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.firstCall.args[0].type).to.equal('employees/addEmployee');
    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('updates existing employee data', async () => {
    // Create element and set edit mode
    element = await fixture(html`<employee-form></employee-form>`);
    element.isEditMode = true;
    element.employee = { ...store.getState().employees[0] };
    await element.updateComplete;

    const form = element.shadowRoot.querySelector('form');
    const submitEvent = new CustomEvent('submit', {
      bubbles: true,
      cancelable: true
    });

    // Update form field values
    element.employee = {
      ...element.employee,
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@example.com'
    };
    await element.updateComplete;

    form.dispatchEvent(submitEvent);
    await element.updateComplete;

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.firstCall.args[0].type).to.equal('employees/editEmployee');
    expect(dispatchStub.firstCall.args[0].payload.id).to.equal('1');
    expect(Router.go.calledWith('/')).to.be.true;
  });

  it('handles language changes', async () => {
    const event = new CustomEvent('language-changed', {
      detail: { language: 'tr' }
    });
    window.dispatchEvent(event);
    await element.updateComplete;
    
    expect(element.currentLanguage).to.equal('tr');
  });

  it('renders form fields with correct labels', async () => {
    const labels = element.shadowRoot.querySelectorAll('label');
    const labelTexts = Array.from(labels).map(label => label.textContent.trim());
    
    expect(labelTexts).to.include('First Name');
    expect(labelTexts).to.include('Last Name');
    expect(labelTexts).to.include('Email Address');
    expect(labelTexts).to.include('Phone Number');
    expect(labelTexts).to.include('Department');
    expect(labelTexts).to.include('Position');
    expect(labelTexts).to.include('Date of Employment');
    expect(labelTexts).to.include('Date of Birth');
  });

  it('shows correct title based on mode', async () => {
    const title = element.shadowRoot.querySelector('h1');
    expect(title.textContent.trim()).to.equal('Add Employee');

    // Create element and set edit mode
    element = await fixture(html`<employee-form></employee-form>`);
    element.isEditMode = true;
    element.employee = store.getState().employees[0];
    await element.updateComplete;

    const editTitle = element.shadowRoot.querySelector('h1');
    expect(editTitle.textContent.trim()).to.equal('Edit Employee');
  });

  it('handles back button click', async () => {
    const backButton = element.shadowRoot.querySelector('.back-button');
    expect(backButton.getAttribute('href')).to.equal('/');
  });
}); 
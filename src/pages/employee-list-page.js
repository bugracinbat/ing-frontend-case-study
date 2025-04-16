import { LitElement, html } from 'lit-element';
import '../components/employee-list.js';

console.log('Loading employee-list-page component');

class EmployeeListPage extends LitElement {
  constructor() {
    super();
    console.log('EmployeeListPage constructor called');
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('EmployeeListPage connected to DOM');
  }

  render() {
    console.log('EmployeeListPage rendering');
    return html`<employee-list></employee-list>`;
  }
}

console.log('Defining employee-list-page custom element');
customElements.define('employee-list-page', EmployeeListPage);

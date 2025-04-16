import './components/navigation-menu.js';
import './pages/employee-list-page.js';
import './pages/employee-form-page.js';
import { Router } from '@vaadin/router';

const outlet = document.querySelector('main');
if (!outlet) {
  throw new Error('Could not find main element in the DOM');
}

const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'employee-list-page' },
  { path: '/add', component: 'employee-form-page' },
  { path: '/edit/:id', component: 'employee-form-page' },
]);

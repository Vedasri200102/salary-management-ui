
import { Routes } from '@angular/router';
import { Employees } from './features/employees/employees';
import { Salaries } from './features/salaries/salaries';

export const routes: Routes = [
  {
    path: 'employees',
    component: Employees
  },
  {
    path: 'salaries',
    component: Salaries
  },
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  }
];

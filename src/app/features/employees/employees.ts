
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Employee,
  EmployeePage,
  EmployeeRequest,
  Department,
  Country
} from '../../core/models/employee.model';

import { EmployeeService } from '../../core/services/employee.services';
import { DepartmentService } from '../../core/services/department.service';
import { CountryService } from '../../core/services/country.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit {

  employees: Employee[] = [];

  departments: Department[] = [];
  countries: Country[] = [];

  page = 0;
  size = 10;
  totalElements = 0;

  keyword = '';

  loading = false;
  saving = false;

  showAddForm = false;
today = new Date().toISOString().split('T')[0];
  errorMessage = '';
  successMessage = '';

  newEmployee: EmployeeRequest = {
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    country: '',
    joiningDate: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // Load employees
  loadEmployees(): void {

    this.loading = true;
    this.errorMessage = '';

    this.cdr.markForCheck();

    this.employeeService
      .getAllEmployees(this.page, this.size, this.keyword)
      .subscribe({

        next: (response: EmployeePage) => {

          this.employees = response.content ?? [];
          this.totalElements = response.totalElements ?? 0;
          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error('Employee API error:', error);

          this.errorMessage = 'Unable to load employees.';
          this.loading = false;

          this.cdr.markForCheck();
        }

      });
  }

  // Search employees
  searchEmployees(): void {
    this.page = 0;
    this.loadEmployees();
  }

  // Pagination
  nextPage(): void {

    if ((this.page + 1) * this.size < this.totalElements) {
      this.page++;
      this.loadEmployees();
    }
  }

  previousPage(): void {

    if (this.page > 0) {
      this.page--;
      this.loadEmployees();
    }
  }

  // Open Add Employee form
  openAddForm(): void {

    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.loadDepartments();
    this.loadCountries();
  }

  // Close Add Employee form
  closeAddForm(): void {

    this.showAddForm = false;
    this.resetForm();
  }

  // Load departments
  loadDepartments(): void {

    this.departmentService.getAllDepartments().subscribe({

      next: (response) => {

        this.departments = response.filter(
          department => department.active
        );

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('Department API error:', error);
        this.errorMessage = 'Unable to load departments.';

        this.cdr.markForCheck();
      }

    });
  }

  // Load countries
  loadCountries(): void {

    this.countryService.getAllCountries().subscribe({

      next: (response) => {

        this.countries = response.filter(
          country => country.active
        );

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('Country API error:', error);
        this.errorMessage = 'Unable to load countries.';

        this.cdr.markForCheck();
      }

    });
  }

  // Save employee
  saveEmployee(): void {

    if (this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService
      .createEmployee(this.newEmployee)
      .subscribe({

        next: (response) => {

          console.log('Employee created:', response);

          this.saving = false;
          this.showAddForm = false;

          this.successMessage = 'Employee added successfully!';

          this.resetForm();

          this.page = 0;
          this.loadEmployees();

          this.cdr.markForCheck();
        },

        error: (error) => {

          console.error('Create employee error:', error);

          this.saving = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to create employee. Please check the entered details.';

          this.cdr.markForCheck();
        }

      });
  }

  // Reset form
  resetForm(): void {

    this.newEmployee = {
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      country: '',
      joiningDate: ''
    };
  }

}

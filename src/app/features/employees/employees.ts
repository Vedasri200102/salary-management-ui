import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeePage } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.services';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
// import { EmployeeService } from '../../core/services/employee.service';
// import { Employee, EmployeePage } from '../../core/models/employee.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss'
})
export class Employees implements OnInit {

  employees: Employee[] = [];

  page = 0;
  size = 10;
  totalElements = 0;

  keyword = '';
  loading = false;
  errorMessage = '';

constructor(
  private employeeService: EmployeeService,
  private cdr: ChangeDetectorRef
) {}
  ngOnInit(): void {
    this.loadEmployees();
  }
loadEmployees(): void {
  this.loading = true;
  this.errorMessage = '';

  this.cdr.markForCheck();

  this.employeeService
    .getAllEmployees(this.page, this.size, this.keyword)
    .subscribe({
      next: (response: EmployeePage) => {

        console.log('API response:', response);

        this.employees = response.content ?? [];
        this.totalElements = response.totalElements ?? 0;
        this.loading = false;

        console.log('Employees:', this.employees);
        console.log('Count:', this.employees.length);

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('API error:', error);

        this.errorMessage = 'Unable to load employees.';
        this.loading = false;

        this.cdr.markForCheck();
      }
    });
}


  searchEmployees(): void {
    this.page = 0;
    this.loadEmployees();
  }

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
}
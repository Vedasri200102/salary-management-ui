
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Employee, EmployeePage } from '../../core/models/employee.model';
import { Salary, SalaryPage, SalaryRequest, PayFrequency } from '../../core/models/salary.model';

import { EmployeeService } from '../../core/services/employee.services';
import { SalaryService } from '../../core/services/salary.service';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salaries.html',
  styleUrl: './salaries.css'
})
export class Salaries implements OnInit {

  employees: Employee[] = [];
  salaries: Salary[] = [];

  page = 0;
  size = 10;
  totalElements = 0;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  showForm = false;

  salaryRequest: SalaryRequest = this.createEmptyRequest();

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadSalaries();
  }

  private createEmptyRequest(): SalaryRequest {
    return {
      employeeId: 0,
      basicSalary: 0,
      allowances: 0,
      bonus: 0,
      deductions: 0,
      payFrequency: 'MONTHLY',
      effectiveFrom: '',
      effectiveTo: null
    };
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees(0, 100).subscribe({
      next: (response: EmployeePage) => {
        this.employees = response.content ?? [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Employee loading error:', error);
        this.errorMessage = 'Unable to load employees for salary entry.';
        this.cdr.markForCheck();
      }
    });
  }

  loadSalaries(): void {
    this.loading = true;
    this.errorMessage = '';

    this.salaryService.getAllSalaries(this.page, this.size).subscribe({
      next: (response: SalaryPage) => {
        this.salaries = response.content ?? [];
        this.totalElements = response.totalElements ?? 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Salary loading error:', error);
        this.errorMessage = 'Unable to load salary records.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openForm(): void {
    this.salaryRequest = this.createEmptyRequest();
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  saveSalary(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.salaryRequest.employeeId ||
        !this.salaryRequest.effectiveFrom) {
      this.errorMessage = 'Please select an employee and effective from date.';
      return;
    }

    if (this.salaryRequest.effectiveTo &&
        this.salaryRequest.effectiveTo < this.salaryRequest.effectiveFrom) {
      this.errorMessage = 'Effective To cannot be before Effective From.';
      return;
    }

    this.saving = true;

    const request: SalaryRequest = {
      ...this.salaryRequest,
      effectiveTo: this.salaryRequest.effectiveTo || null
    };

    this.salaryService.createSalary(request).subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.successMessage = 'Salary record created successfully.';
        this.page = 0;
        this.loadSalaries();
        this.salaryRequest = this.createEmptyRequest();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Salary save error:', error);
        this.saving = false;
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to save salary record. Please check the entered details.';
        this.cdr.markForCheck();
      }
    });
  }

  nextPage(): void {
    if ((this.page + 1) * this.size < this.totalElements) {
      this.page++;
      this.loadSalaries();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadSalaries();
    }
  }

  get grossSalary(): number {
    return Number(this.salaryRequest.basicSalary || 0) +
      Number(this.salaryRequest.allowances || 0) +
      Number(this.salaryRequest.bonus || 0);
  }

  get netSalary(): number {
    return this.grossSalary -
      Number(this.salaryRequest.deductions || 0);
  }

  getEmployeeName(employee: Employee): string {
    return `${employee.employeeCode} - ${employee.firstName} ${employee.lastName}`;
  }
}

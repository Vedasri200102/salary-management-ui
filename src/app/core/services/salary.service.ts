
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Salary,
  SalaryRequest,
  SalaryPage
} from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private apiUrl = '/api/salaries';

  constructor(private http: HttpClient) {}

  // Get all salaries with pagination
  getAllSalaries(
    page: number = 0,
    size: number = 10
  ): Observable<SalaryPage> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<SalaryPage>(
      this.apiUrl,
      { params }
    );
  }

  // Get salary by ID
  getSalaryById(id: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/${id}`);
  }

  // Get employee salary history
  getSalaryHistory(
    employeeId: number,
    page: number = 0,
    size: number = 10
  ): Observable<SalaryPage> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<SalaryPage>(
      `${this.apiUrl}/employee/${employeeId}`,
      { params }
    );
  }

  // Create salary
  createSalary(request: SalaryRequest): Observable<Salary> {
    return this.http.post<Salary>(
      this.apiUrl,
      request
    );
  }
}

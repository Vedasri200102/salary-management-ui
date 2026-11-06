
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Employee,
  EmployeeRequest,
  EmployeePage
} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = '/api/employees';

  constructor(private http: HttpClient) {}

  // Get all employees with pagination
 
    getAllEmployees(
    page: number = 0,
    size: number = 10,
    keyword: string = ''
    ): Observable<EmployeePage> {

    let params = new HttpParams()
        .set('page', page)
        .set('size', size);

    if (keyword.trim()) {
        params = params.set('keyword', keyword.trim());
    }

    return this.http.get<EmployeePage>(
        this.apiUrl,
        { params }
    );
    }


  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {

    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`
    );
  }

  // Create employee
  createEmployee(
    employee: EmployeeRequest
  ): Observable<Employee> {

    return this.http.post<Employee>(
      this.apiUrl,
      employee
    );
  }

  // Update employee
  updateEmployee(
    id: number,
    employee: EmployeeRequest
  ): Observable<Employee> {

    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  // Delete employee
  deleteEmployee(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}

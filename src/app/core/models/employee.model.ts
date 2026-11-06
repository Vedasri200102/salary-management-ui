
export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  active: boolean;
}

export interface Country {
  id: number;
  countryName: string;
  countryCode: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  active: boolean;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  country: Country;
  joiningDate: string;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
}

export interface EmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  countryId: number;
  joiningDate: string;
}

export interface EmployeePage {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

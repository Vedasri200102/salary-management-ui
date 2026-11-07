
export type PayFrequency = 'MONTHLY' | 'ANNUAL';

export interface Salary {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;

  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;

  grossSalary: number;
  netSalary: number;

  currencyCode: string;
  payFrequency: PayFrequency;

  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface SalaryRequest {
  employeeId: number;
  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  payFrequency: PayFrequency;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface SalaryPage {
  content: Salary[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

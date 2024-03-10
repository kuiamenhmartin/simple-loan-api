import {Prettify} from '../types';

export enum LoanType {
  CAR = 'CAR',
  PERSONAL = 'PERSONAL',
}

export type LoanApplication = {
  id?: string;
  firstName: string;
  lastName: string;
  income: number;
  loanType: LoanType;
  loanAmount: number;
  interestRate: number;
};

export type ComputedLoanApplication = Prettify<
  LoanApplication & {
    monthlyPayment: number;
  }
>;

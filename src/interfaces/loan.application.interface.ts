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

export type LoanApplicationWithMonthlyPayment = LoanApplication & {
  monthlyPayment: number;
};

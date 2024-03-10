import {LoanApplication, LoanType} from '../../interfaces';

export const LoanEndpoint = '/api/loans';

export const LoanApplicationId = '657e34c7b10435878a984623f1af269f';

export const CurrentLoanApplications: LoanApplication[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    income: 1000,
    interestRate: 14.75,
    loanAmount: 1000,
    loanType: LoanType.CAR,
  },

  {
    firstName: 'Jane',
    lastName: 'Smith',
    income: 1000,
    interestRate: 14.75,
    loanAmount: 1000,
    loanType: LoanType.PERSONAL,
  },
];

export const SingleLoanApplication: LoanApplication =
  CurrentLoanApplications[0];

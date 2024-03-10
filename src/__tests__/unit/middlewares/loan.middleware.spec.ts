import {Meta} from 'express-validator';
import {expect} from 'chai';
import {LoanType} from '../../../interfaces';
import {
  isGreaterThanZero,
  isLoanAmountExceedsLimit,
} from '../../../middlewares';
import {
  CAR_LOAN_AMOUNT_LIMIT,
  PERSONAL_LOAN_AMOUNT_LIMIT,
} from '../../../constants';

describe('Loan Middleware (unit)', () => {
  const mockMeta = {
    path: '/api/loans',
    method: 'get',
  } as unknown as Meta;

  it('should test is greater than zero', async () => {
    // test case when inputNum is less than one
    let inputNum = -1;
    isGreaterThanZero(inputNum, mockMeta).catch(err => {
      expect((err as Error).message).to.be.not.empty;
    });

    // test case when inputNum is greater than zero
    inputNum = 1000;
    const response = await isGreaterThanZero(inputNum, mockMeta);
    expect(response).to.be.true;
  });

  it('should test is loan amount exceeds limit', async () => {
    // test case when loan type is CAR and loan amount exceeds loan amount for CAR
    let mockMeta2 = {
      ...mockMeta,
      req: {
        body: {
          loanType: LoanType.CAR,
        },
      },
    };
    let loanAmount = CAR_LOAN_AMOUNT_LIMIT + 1000;

    isLoanAmountExceedsLimit(loanAmount, mockMeta2).catch(err => {
      expect((err as Error).message).to.be.not.empty;
    });

    // test case when loan type is PERSONAL and loan amount exceeds loan amount for PERSONAL
    mockMeta2 = {
      ...mockMeta,
      req: {
        body: {
          loanType: LoanType.PERSONAL,
        },
      },
    };
    loanAmount = PERSONAL_LOAN_AMOUNT_LIMIT + 1000;
    isLoanAmountExceedsLimit(loanAmount, mockMeta2).catch(err => {
      expect((err as Error).message).to.be.not.empty;
    });

    // test case when either of loan type exceeds loan amount limit
    mockMeta2 = {
      ...mockMeta,
      req: {
        body: {
          loanType: LoanType.PERSONAL,
        },
      },
    };
    loanAmount = PERSONAL_LOAN_AMOUNT_LIMIT;
    const response = await isLoanAmountExceedsLimit(loanAmount, mockMeta2);
    expect(response).to.be.true;
  });
});

import {Meta, ValidationChain, body, param} from 'express-validator';
import {LoanApplication, LoanType} from '../interfaces';
import {
  CAR_LOAN_AMOUNT_LIMIT,
  PERSONAL_LOAN_AMOUNT_LIMIT,
} from '../constants/loan.constant';

/**
 * isGreaterThanZero - checks if input value is greather than zero
 * @param inputNum http data
 * @param meta metadata about a validated field
 * @returns Promise<boolean>
 */
export const isGreaterThanZero = async (inputNum: number, meta: Meta) => {
  if (inputNum <= 0) {
    throw new Error(`${meta.path} must be greater than zero`);
  }
  return true;
};

/**
 * isLoanAmountExceedsLimit - checks if input value exceeds loan amount
 * @param loanAmount http data
 * @param meta metadata about a validated field
 * @returns Promise<boolean>
 */
export const isLoanAmountExceedsLimit = async (
  loanAmount: number,
  meta: Meta
) => {
  const loanType = (meta.req.body as LoanApplication).loanType;
  if (loanType === LoanType.CAR && loanAmount > CAR_LOAN_AMOUNT_LIMIT) {
    throw new Error(
      `${meta.path} should not exceed ${LoanType.CAR} loan amount limit of ${CAR_LOAN_AMOUNT_LIMIT}`
    );
  }

  if (
    loanType === LoanType.PERSONAL &&
    loanAmount > PERSONAL_LOAN_AMOUNT_LIMIT
  ) {
    throw new Error(
      `${meta.path} should not exceed ${LoanType.PERSONAL} loan amount limit of ${PERSONAL_LOAN_AMOUNT_LIMIT}`
    );
  }

  return true;
};

export const LoanBodyValidation: ValidationChain[] = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('firstName is required')
    .bail()
    .isLength({min: 2})
    .withMessage('firstName must have minimum characters of 2'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('lastName is required')
    .bail()
    .isLength({min: 2})
    .withMessage('lastName must have minimum characters of 2'),
  body('loanAmount')
    .optional({checkFalsy: false})
    .bail()
    .isNumeric()
    .withMessage('loanAmount should be numeric')
    .bail()
    .custom(isGreaterThanZero)
    .custom(isLoanAmountExceedsLimit),
  body('income')
    .optional({checkFalsy: false})
    .bail()
    .isNumeric()
    .withMessage('income should be a number')
    .bail()
    .custom(isGreaterThanZero),
  body('interestRate')
    .optional({checkFalsy: false})
    .bail()
    .isNumeric()
    .withMessage('interestRate should be a number')
    .bail()
    .custom(isGreaterThanZero),
  body('loanType')
    .trim()
    .notEmpty()
    .withMessage('loanType is required')
    .bail()
    .isIn(Object.values(LoanType))
    .withMessage(
      `loanType must be one of the following ${Object.values(LoanType).join(
        ' | '
      )}`
    ),
];

export const LoanParamValidation: ValidationChain[] = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Loan Application Id is required')
    .bail()
    .matches(/^[0-9a-fA-F]{32}$/)
    .withMessage(
      'Loan Application Id must be a valid hexadecimal of length 32'
    ),
];

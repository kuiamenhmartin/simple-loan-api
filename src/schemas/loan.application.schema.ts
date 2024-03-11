import {z} from 'zod';
import {Prettify} from '../types';
import {CAR_LOAN_AMOUNT_LIMIT, PERSONAL_LOAN_AMOUNT_LIMIT} from '../constants';

export enum LoanType {
  CAR = 'CAR',
  PERSONAL = 'PERSONAL',
}

type InferredLoanApplicationType = z.infer<typeof loanApplicationSchema>;

// Loan application type based on schema
export type LoanApplication =
  InferredLoanApplicationType[keyof InferredLoanApplicationType];

// Loan application with computed mothly payment
export type ComputedLoanApplication = Prettify<
  LoanApplication & {
    monthlyPayment: number;
  }
>;

// Loan application schema validation
// Can be inferred to a type on demand
export const loanApplicationSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      firstName: z.string().trim().min(3),
      lastName: z.string().trim().min(3),
      income: z
        .number()
        .min(1, {message: 'income must be greater than or equal to 1'}),
      loanAmount: z
        .number()
        .min(1, {message: 'loanAmount must be greater than or equal to 1'}),
      interestRate: z
        .number()
        .min(1, {message: 'interestRate must be greater than or equal to 1'}),
      loanType: z.nativeEnum(LoanType),
    })
    .superRefine((schema, ctx) => {
      if (
        schema.loanType === LoanType.CAR &&
        schema.loanAmount > CAR_LOAN_AMOUNT_LIMIT
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: CAR_LOAN_AMOUNT_LIMIT,
          type: 'number',
          message: `loanAmount should not exceed ${LoanType.CAR} loan amount limit of ${CAR_LOAN_AMOUNT_LIMIT}`,
          path: ['loanAmount'],
        } as unknown as z.IssueData);
      }

      if (
        schema.loanType === LoanType.PERSONAL &&
        schema.loanAmount > PERSONAL_LOAN_AMOUNT_LIMIT
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: PERSONAL_LOAN_AMOUNT_LIMIT,
          type: 'number',
          message: `loanAmount should not exceed ${LoanType.PERSONAL} loan amount limit of ${PERSONAL_LOAN_AMOUNT_LIMIT}`,
          path: ['loanAmount'],
        } as unknown as z.IssueData);
      }
    }),
});

export const loanApplicationParamSchema = z.object({
  params: z.object({
    id: z.string().trim().length(32, {
      message: 'Loan Application Id must be a valid hexadecimal of length 32',
    }),
  }),
});

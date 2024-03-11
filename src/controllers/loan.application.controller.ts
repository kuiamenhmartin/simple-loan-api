import {Request} from 'express';
import {HttpStatusCodes} from '../constants';
import {ResponseType} from '../types';
import {LoanApplicationService} from '../services';
import {calculateMonthlyPayment} from '../utils';
import {
  ComputedLoanApplication,
  LoanApplication,
  loanApplicationParamSchema,
  loanApplicationSchema,
} from '../schemas';

export class LoanApplicationController {
  loanApplicationService: LoanApplicationService;

  constructor() {
    this.loanApplicationService = new LoanApplicationService();
  }

  /**
   * create - creates a new loan application
   * @param req - the express Request
   * @returns Promise<ResponseType<ComputedLoanApplication>> - the newly created loan application
   */
  async create(req: Request): Promise<ResponseType<ComputedLoanApplication>> {
    const {body: loanApplicationData} = loanApplicationSchema.parse(req);

    // create new loan application
    const loanApplcation =
      await this.loanApplicationService.create(loanApplicationData);

    // get payment term based on loan type
    const loanTerm = this.loanApplicationService.getLoanTerm(
      loanApplcation.loanType
    );

    // compute for monthly payment
    let monthlyPayment = calculateMonthlyPayment(
      loanApplcation.loanAmount,
      loanApplcation.interestRate,
      loanTerm as number
    );
    monthlyPayment = Math.floor(monthlyPayment * 100) / 100;

    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: 'New Loan Application successfully created!',
      data: {
        ...loanApplcation,
        monthlyPayment,
      },
    };
  }

  /**
   * findAll - retrieves all loan applications
   * @param req - the express Request
   * @returns Promise<ResponseType<LoanApplication[]>> - list of all loan applications
   */
  async findAll(): Promise<ResponseType<LoanApplication[]>> {
    const data = await this.loanApplicationService.findAll();
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: 'Loan Applications successfully retrieved!',
      data,
    };
  }

  /**
   * findById - retrieves loan application by ID
   * @param req - the express Request
   * @returns Promise<ResponseType<LoanApplication>> - loan application
   */
  async findById(req: Request): Promise<ResponseType<LoanApplication>> {
    const {params} = loanApplicationParamSchema.parse(req);
    const loanApplication = await this.loanApplicationService.findById(
      params.id as string
    );
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: 'Loan application successfully retrieved!',
      data: loanApplication,
    };
  }

  /**
   * update - update loan application by ID
   * @param req - the express Request
   * @returns Promise<ResponseType> - response message
   */
  async update(req: Request): Promise<ResponseType> {
    const {params} = loanApplicationParamSchema.parse(req);
    const {body} = loanApplicationSchema.parse(req);
    const loanApplicationData = {...body, ...params} as LoanApplication;
    await this.loanApplicationService.update(
      loanApplicationData.id as string,
      loanApplicationData
    );
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: `Loan application '${loanApplicationData.id}' successfully updated!`,
    };
  }

  /**
   * delete - deletes a loan application by ID
   * @param req - the express Request
   * @returns Promise<ResponseType> - response message
   */
  async delete(req: Request): Promise<ResponseType> {
    const {params} = loanApplicationParamSchema.parse(req);
    await this.loanApplicationService.delete(params.id as string);
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: `Loan application '${params.id}' successfully deleted!`,
    };
  }
}

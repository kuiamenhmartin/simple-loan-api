import {Request} from 'express';
import {HttpStatusCodes} from '../constants';
import {matchedData} from 'express-validator';
import {ComputedLoanApplication, LoanApplication} from '../interfaces';
import {ResponseType} from '../types';
import {LoanApplicationService} from '../services';
import {calculateMonthlyPayment} from '../utils';

export class LoanApplicationController {
  loanApplicationService: LoanApplicationService;

  constructor() {
    this.loanApplicationService = new LoanApplicationService();
  }

  /**
   * create - creates a new loan application
   * @param req - the express Request
   * @returns Promise<ResponseType<LoanApplication>> - the newly created loan application
   */
  async create(req: Request): Promise<ResponseType<ComputedLoanApplication>> {
    const data = matchedData(req, {includeOptionals: false}) as LoanApplication;

    // create new loan application
    const loanApplcation = await this.loanApplicationService.create(data);

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
    const params = matchedData(req, {includeOptionals: false});
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
    const data = matchedData(req, {includeOptionals: false}) as LoanApplication;
    await this.loanApplicationService.update(data.id as string, data);
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: `Loan application '${data.id}' successfully updated!`,
    };
  }

  /**
   * delete - deletes a loan application by ID
   * @param req - the express Request
   * @returns Promise<ResponseType> - response message
   */
  async delete(req: Request): Promise<ResponseType> {
    const data = matchedData(req, {includeOptionals: false});
    await this.loanApplicationService.delete(data.id as string);
    return {
      status: HttpStatusCodes.OK,
      success: true,
      message: `Loan application '${data.id}' successfully deleted!`,
    };
  }
}

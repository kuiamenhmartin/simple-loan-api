import {CAR_LOAN_TERM, PERSONAL_LOAN_TERM} from '../constants';
import {LoanApplicationRepository} from '../repository';
import {LoanApplication, LoanType} from '../schemas';
import {ResourceNotFoundExceptionError} from '../utils';
import {LoggerService} from './logger.service';

export class LoanApplicationService {
  loanApplicationRepository: LoanApplicationRepository;
  logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(LoanApplicationRepository.name);
    this.loanApplicationRepository = new LoanApplicationRepository();
  }

  /**
   * findAll - returns array of loan applications
   * @returns Promise<LoanApplication[]> - list of loans
   */
  async findAll(): Promise<LoanApplication[]> {
    return (await this.loanApplicationRepository.findAll()) as LoanApplication[];
  }

  /**
   * findById - returns loan application by id
   * @param applicationId - loan application id
   * @returns Promise<LoanApplication>
   */
  async findById(applicationId: string): Promise<LoanApplication> {
    const loanApplication =
      await this.loanApplicationRepository.findById(applicationId);

    if (!loanApplication) {
      const errMsg = `Unknown loan application '${applicationId}'`;
      this.logger.error(errMsg);
      throw new ResourceNotFoundExceptionError(errMsg);
    }

    return {id: applicationId, ...loanApplication} as LoanApplication;
  }

  /**
   * create - creates new loan application
   * @param loanApplication - loan application to create
   * @returns Promise<LoanApplication>
   */
  async create(loanApplication: LoanApplication): Promise<LoanApplication> {
    const newLoanApplication =
      await this.loanApplicationRepository.create(loanApplication);
    this.logger.info(`new loan application created ${newLoanApplication.id}`);
    return newLoanApplication as LoanApplication;
  }

  /**
   * update - update loan application using loanApplication id
   * @param applicationId - loan application id
   * @param loan - loan data to update
   * @returns Promise<void>
   */
  async update(
    applicationId: string,
    loanApplication: Partial<LoanApplication>
  ): Promise<void> {
    const oldLoanApplication = await this.findById(applicationId);
    const updatedLoanApplication = {
      ...oldLoanApplication,
      ...loanApplication,
    };

    await this.loanApplicationRepository.update(
      applicationId,
      updatedLoanApplication
    );
    this.logger.info(`updated loan application '${applicationId}'`);
  }

  /**
   * removeLoanApplication - deletes loan using loan application by id
   * @param applicationId - loan application id
   * @returns Promise<void>
   */
  async delete(applicationId: string): Promise<void> {
    await this.findById(applicationId);
    await this.loanApplicationRepository.delete(applicationId);
    this.logger.info(`deleted loan application '${applicationId}'`);
  }

  /**
   * getLoanTerm - get loan term by loan type
   * @param loanType car | personal
   * @returns loan term by year
   */
  getLoanTerm(loanType: LoanType): number | void {
    if (loanType === LoanType.CAR) {
      return CAR_LOAN_TERM;
    }

    if (loanType === LoanType.PERSONAL) {
      return PERSONAL_LOAN_TERM;
    }
  }
}

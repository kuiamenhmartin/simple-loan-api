import { CAR_LOAN_TERM, PERSONAL_LOAN_TERM } from "../constants/loan.constants";
import { LoanApplication, LoanType } from "../interfaces";
import { LoanApplicationRepository } from "../repository";
import { HttpErrors } from "../utils";
import { LoggerService } from "./logger.service";

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
    async findAll() {
        return await this.loanApplicationRepository.findAll() as LoanApplication[];
    }

    /**
     * findById - returns loan application by id
     * @param applicationId - loan application id
     * @returns Promise<Loan>
     */
    async findById(applicationId: string) {
        const loanApplication = await this.loanApplicationRepository.findById(applicationId);

        if (!loanApplication) {
            const errMsg = `Loan application '${applicationId}' not found.`;
            this.logger.info(errMsg);
            throw HttpErrors.NotFound(errMsg);
        }

        return { id: applicationId, ...loanApplication } as LoanApplication;
    }

    /**
     * create - creates new loan application
     * @param loanApplication - loan application to create
     */
    async create(loanApplication: LoanApplication) {
        const newLoanApplication = await this.loanApplicationRepository.create(loanApplication);
        this.logger.info(`new loan application created ${newLoanApplication.id}`);
        return newLoanApplication;
    }

    /**
     * update - update loan application using loanApplication id
     * @param applicationId - loan application id
     * @param loan - loan data to update 
     */
    async update(applicationId: string, loanApplication: Partial<LoanApplication>) {
        const oldLoanApplication = await this.loanApplicationRepository.findById(applicationId);

        if (!oldLoanApplication) {
            const errMsg = `Loan application not found ${applicationId}`;
            this.logger.info(errMsg);
            throw HttpErrors.NotFound(errMsg);
        }

        const updatedLoanApplication = {
            ...oldLoanApplication,
            ...loanApplication
        };

        await this.loanApplicationRepository.update(applicationId, updatedLoanApplication);
        this.logger.info(`updated loan application '${applicationId}'`);
    }

    /**
     * removeLoanApplication - deletes loan using loan application by id
     * @param applicationId - loan application id
     */
    async delete(applicationId: string) {
        const result = await this.loanApplicationRepository.findById(applicationId);

        if (!result) {
            const errMsg = `Unable to delete loan application. Loan application not found ${applicationId}`;
            this.logger.info(errMsg);
            throw HttpErrors.NotFound(errMsg);
        }

        await this.loanApplicationRepository.delete(applicationId);
        this.logger.info(`deleted loan application '${applicationId}'`);
    }

    /**
     * getLoanTerm - get loan term by loan type
     * @param loanType car | personal
     * @returns loan term by year
     */
    getLoanTerm(loanType: LoanType): number {
       if(loanType === LoanType.CAR) {
        return CAR_LOAN_TERM;
       }

       if (loanType === LoanType.PERSONAL) {
        return PERSONAL_LOAN_TERM;
       }

       throw HttpErrors.BadRequest(`Loan type must be one of the following ${Object.values(LoanType).join(' | ')}`);
    }

}
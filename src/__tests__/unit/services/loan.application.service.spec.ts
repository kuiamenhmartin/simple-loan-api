import sinon from 'sinon';
import { expect } from 'chai';
import { LoanApplicationService } from '../../../services';
import { CurrentLoanApplications, LoanApplicationId, SingleLoanApplication } from '../../fixtures/loan.application.fixture';
import { LoanApplicationRepository } from '../../../repository';
import { LoanApplication, LoanType } from '../../../interfaces';
import { CAR_LOAN_TERM, PERSONAL_LOAN_TERM } from '../../../constants/loan.constants';

describe('Loan Application Service (unit)', () => {
    let loanApplicationService: LoanApplicationService;
    let testSandbox = sinon.createSandbox();
    let loanApplicationRepositoryStub: sinon.SinonStubbedInstance<LoanApplicationRepository>;

    before(() => {
        loanApplicationService = new LoanApplicationService();
    });

    beforeEach(async () => {
        // stub create method
        loanApplicationRepositoryStub = testSandbox.stub(LoanApplicationRepository.prototype);
    });

    afterEach(() => {
        testSandbox.restore();
    })

    it('test case create new loan application <create>', async () => {
        // prepare loan applicaton data
        const loandApplicationId = LoanApplicationId;
        const loanApplicationData = { ...SingleLoanApplication } as LoanApplication;

        // stub repository create method and define return data
        loanApplicationRepositoryStub.create.resolves({ ...loanApplicationData, id: loandApplicationId });
        const response = await loanApplicationService.create(loanApplicationData);

        expect(response).to.not.null;
        expect(response).to.be.includes(loanApplicationData);
    });


    it('test case delete loan application <delete>', async () => {
        // prepare loan applicaton data
        const loandApplicationId = LoanApplicationId;
        const loanAplication = { ...SingleLoanApplication };
        // stub repository delete method
        loanApplicationRepositoryStub.delete.resolves();

        // Test case: application to be deleted is not found or does not exist
        loanApplicationRepositoryStub.findById.resolves(undefined);
        loanApplicationService.delete(loandApplicationId)
        .catch((err) => {
            expect((err as Error).message).to.be.eql(`Unable to delete loan application. Loan application not found ${loandApplicationId}`);
        })

        // Test case: application to be deleted is found
        loanApplicationRepositoryStub.findById.resolves(loanAplication);
        const response = await loanApplicationService.delete(loandApplicationId);
        expect(response).to.be.undefined;
        
    });

    it('test case find all loan applications <findAll>', async () => {
        // prepare loan applicaton data
        const loansApplications = [ ...CurrentLoanApplications ];
        loanApplicationRepositoryStub.findAll.resolves(loansApplications);
        const response = await loanApplicationService.findAll();
        expect(response).to.be.eqls(loansApplications);
    });

    it('test case find loan application by loan application id <findById>', async () => {
        // prepare loan applicaton data
        const loandApplicationId = LoanApplicationId;
        const loanAplication = { ...SingleLoanApplication, id: loandApplicationId };

        // Test case: application being searched is not found or does not exist
        loanApplicationRepositoryStub.findById.resolves(undefined);
        loanApplicationService.findById(loandApplicationId)
        .catch((err) => {
            expect((err as Error).message).to.be.eql(`Loan application '${loandApplicationId}' not found.`);
        })

        // Test case: application is found
        loanApplicationRepositoryStub.findById.resolves(loanAplication);
        const response = await loanApplicationService.findById(loandApplicationId);
        expect(response).to.be.not.null;
        expect(response).to.be.eqls(loanAplication);
    });

    it('test case update loan application by loan application id <update>', async () => {
        // prepare loan applicaton data
        const loandApplicationId = LoanApplicationId;
        const loanAplication = { ...SingleLoanApplication, id: loandApplicationId };

        // Test case: application being searched is not found or does not exist
        loanApplicationRepositoryStub.findById.resolves(undefined);
        loanApplicationService.update(loandApplicationId, loanAplication)
        .catch((err) => {
            expect((err as Error).message).to.be.eql(`Loan application not found ${loandApplicationId}`);
        })

        // Test case: application is found and can be updated
        loanApplicationRepositoryStub.findById.resolves(loanAplication);
        const response = await loanApplicationService.update(loandApplicationId, loanAplication);
        expect(response).to.be.undefined;
    });

    it('test case get loan term based on loan type <getLoanTerm>', async () => {
        // prepare loan applicaton data
        const loanTypeCar = LoanType.CAR;
        const loanTypePersonal = LoanType.PERSONAL;
        const carLoanTerm = CAR_LOAN_TERM;
        const personalLoanTerm = PERSONAL_LOAN_TERM;
        const uknownTerm = 'Mortgagee' as LoanType;

        // Test case: get loan term for loan type CAR
        const response = loanApplicationService.getLoanTerm(loanTypeCar);
        expect(response).to.be.eql(carLoanTerm);

        // Test case: get loan term for loan type PERSONAL
        const response2 = loanApplicationService.getLoanTerm(loanTypePersonal);
        expect(response2).to.be.eql(personalLoanTerm);

        // Test case: uknown loan type
        try {
            loanApplicationService.getLoanTerm(uknownTerm);
        }catch(err) {
            expect((err as Error).message).to.be.not.empty
        }
        
    });
});
import express, {json, urlencoded} from 'express';
import supertest from 'supertest';
import {Server} from 'http';
import {loanRouter} from '../../routes';
import {expect} from 'chai';
import {
  TestConfig,
  SingleLoanApplication,
  LoanEndpoint,
  createNewLoanApplicationFixture,
} from '../fixtures';
import {LoanType} from '../../interfaces';
import {HttpStatusCodes} from '../../constants';

describe('Loan Application Controller (integration)', () => {
  const app = express();
  let server: Server;
  let port = TestConfig.PORT;
  // base loan endpoint
  const loanEndpoint = LoanEndpoint;

  before(async () => {
    app.use(json());
    app.use(urlencoded({extended: true}));
    app.use(loanRouter);
    server = app.listen(port++);
  });

  describe('should test general error response', async () => {
    it('test case to return response status 404 NOT FOUND', async () => {
      const unrecognizedEnpoint = '/api/loan';

      const response = await supertest(app)
        .post(unrecognizedEnpoint)
        .send(SingleLoanApplication)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe('should test create new loang application endpoint [post]/api/loans', async () => {
    it('test case to create new application', async () => {
      const response = await createNewLoanApplicationFixture(
        app,
        SingleLoanApplication
      );

      expect(response.status).to.be.equal(HttpStatusCodes.OK);
      expect(response.body).to.haveOwnProperty('data');
      expect(response.body.data.loanType).eqls(SingleLoanApplication.loanType);
    });

    it('test case for invalid loan application data', async () => {
      const loanApplication = {...SingleLoanApplication};
      // fake the loan type
      loanApplication.loanType = 'Mortgage' as LoanType;

      const response = await supertest(app)
        .post(loanEndpoint)
        .send(loanApplication)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).match(/json/);
      expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
      expect(response.body.data[0].msg).not.empty;
    });
  });

  describe('should test get loan applications endpoint [get]/api/loans', async () => {
    it('test case retrieve all loan applications', async () => {
      const response = await supertest(app)
        .get(loanEndpoint)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.OK);
      expect(response.body).to.haveOwnProperty('data');
    });
  });

  describe('should test delete loan application endpoint [delete]/api/loans/:id', async () => {
    it('test case to delete loan successfully', async () => {
      const createdNewLoan = await createNewLoanApplicationFixture(
        app,
        SingleLoanApplication
      );
      const loanApplicationId = createdNewLoan.body.data.id;
      const deleteEndpoint = loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .delete(deleteEndpoint)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.OK);
    });

    it('test case for invalid loan application id', async () => {
      const loanApplicationId = 'invalid app id';
      const deleteEndpoint = loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .delete(deleteEndpoint)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    });
  });

  describe('should test update loan application endpoint [put]/api/loans/:id', async () => {
    it('test case to update existing loan application', async () => {
      const createdNewLoan = await createNewLoanApplicationFixture(
        app,
        SingleLoanApplication
      );
      const loanApplicationId = createdNewLoan.body.data.id;
      const updateEndpoint = loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .put(updateEndpoint)
        .send(SingleLoanApplication)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.OK);
    });

    it('test case for invalid loan application id', async () => {
      const loanApplicationId = 'invalid app id';
      const updateEndpoint = loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .delete(updateEndpoint)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    });
  });

  describe('should test find by application id endpoint [get]/api/loans/:id', async () => {
    it('test case to find loan application by id', async () => {
      const createdNewLoan = await createNewLoanApplicationFixture(
        app,
        SingleLoanApplication
      );
      const loanApplicationId = createdNewLoan.body.data.id;
      const findByApplicationIdEndpoint =
        loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .get(findByApplicationIdEndpoint)
        .send(SingleLoanApplication)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.OK);
    });

    it('test case for invalid application id', async () => {
      const loanApplicationId = 'invalid app id';
      const findByApplicationIdEndpoint =
        loanEndpoint + '/' + loanApplicationId;

      const response = await supertest(app)
        .get(findByApplicationIdEndpoint)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).to.be.equal(HttpStatusCodes.BAD_REQUEST);
    });
  });

  after(() => {
    server.close();
  });
});

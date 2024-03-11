import express from 'express';
import supertest from 'supertest';
import {LoanEndpoint} from './loan.application.fixture';
import {LoanApplication} from '../../schemas';

export const createNewLoanApplicationFixture = async (
  app: ReturnType<typeof express>,
  loanData: LoanApplication
) => {
  return await supertest(app)
    .post(LoanEndpoint)
    .send(loanData)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
};

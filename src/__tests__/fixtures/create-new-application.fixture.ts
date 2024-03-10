import express from "express";
import supertest from "supertest";
import { LoanApplication } from "../../interfaces";
import { LoanEndpoint } from "./loan.application.fixture";

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
  
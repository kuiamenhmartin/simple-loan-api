import { LoanApplication, LoanType } from "../../interfaces";
import supertest from "supertest";
import express from 'express';

export const LoanEndpoint = '/api/loans';

export const LoanApplicationId = '657e34c7b10435878a984623f1af269f';

export const CurrentLoanApplications: LoanApplication[] = [
    {
        firstName: "John",
        lastName: "Doe",
        income: 1000,
        interestRate: 14.75,
        loanAmount: 1000,
        loanType: LoanType.CAR
    },

    {
        firstName: "Jane",
        lastName: "Smith",
        income: 1000,
        interestRate: 14.75,
        loanAmount: 1000,
        loanType: LoanType.PERSONAL
    }
];

export const SingleLoanApplication: LoanApplication = CurrentLoanApplications[0];

export const createNewLoanApplicationFixture = async(app: ReturnType<typeof express>, loanData: LoanApplication) => {
    return await supertest(app).post(LoanEndpoint)
    .send(SingleLoanApplication)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
}
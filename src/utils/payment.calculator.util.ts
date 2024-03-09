/**
 * Calculate monthly payment based on loan amount, interest rate, and loan term
 * @param loanAmount amount loan
 * @param interestRate interest rate used for computation
 * @param loanTerm loan term in years base on loan type (car, personal)
 * @returns monthlyPayment
 */
export const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): number => {
  // Convert annual rate to monthly and percentage to decimal
  const monthlyInterestRate = interestRate / 12 / 100;

  // Convert term in years to number of monthly payments
  const numberOfPayments = loanTerm * 12;

  // Calculate monthly payment using the formula
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

  return monthlyPayment;
};

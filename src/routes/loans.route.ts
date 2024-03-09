import express from 'express';
import {LoanApplicationController} from '../controllers';
import {RouterTryCatch} from '../utils';
import {
  LoanBodyValidation,
  LoanParamValidation,
  ValidatorMiddleware,
} from '../middlewares';

const router = express.Router();
const controller = new LoanApplicationController();

// Create a new loan
router.post(
  '/api/loans',
  LoanBodyValidation,
  ValidatorMiddleware,
  RouterTryCatch(controller.create.bind(controller))
);

// Retrieve a list of all loan applications
router.get('/api/loans', RouterTryCatch(controller.findAll.bind(controller)));

// Retrieve a specific loan by ID
router.get(
  '/api/loans/:id',
  LoanParamValidation,
  ValidatorMiddleware,
  RouterTryCatch(controller.findById.bind(controller))
);

// Update a specific loan by ID
router.put(
  '/api/loans/:id',
  LoanParamValidation,
  LoanBodyValidation,
  ValidatorMiddleware,
  RouterTryCatch(controller.update.bind(controller))
);

// Delete a specific loan
router.delete(
  '/api/loans/:id',
  LoanParamValidation,
  ValidatorMiddleware,
  RouterTryCatch(controller.delete.bind(controller))
);

// export loan router
export {router as loanRouter};

import {
  createCompanyHandler,
  fetchCompanyHandler,
  updateCompanyHandler,
  deactivateCompanyHandler,
  fetchCompaniesHandler,
} from '../controllers/company.controller';
import validate from '../middlewares/validate';
import { createCompanyValidation, updateCompanyValidation } from './validations/company.validation';

const router = require('express').Router();

router.post('/company/create', validate(createCompanyValidation), createCompanyHandler);
router.get('/company', fetchCompaniesHandler);
router.get('/company/:id', fetchCompanyHandler);
router.patch('/company/update/:id', validate(updateCompanyValidation), updateCompanyHandler);
router.delete('/company/deactivate/:id', deactivateCompanyHandler);

export default router;

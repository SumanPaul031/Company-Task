const express = require('express');
const router = express.Router();

const CompanyController = require('../controllers/company');
const checkAuths = require('../middleware/check-auth');

router.get('/', checkAuths.userAuth, CompanyController.getAllCompanies);

router.get('/:companyId', checkAuths.userAuth, CompanyController.getOneCompany);

router.post('/', checkAuths.userAuth, CompanyController.createCompany);

router.post('/:companyId', checkAuths.userAuth, CompanyController.onboardCompany);

router.get('/onboarded/:companyId', checkAuths.userAuth, CompanyController.getOnboardedCompany);

router.delete('/:companyId', checkAuths.userAuth, CompanyController.deleteCompany);

module.exports = router;
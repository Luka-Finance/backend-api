// Import packages
import { Router, Response, Request } from 'express';

// Import function files
import {
	preLogin,
	register,
	getStaffData,
	resendOtp,
	updatePassword,
	resetPassword,
	changePassword,
	verifyOtp,
	updateStaffSettings,
	updateStaffProfile,
	setTransPin,
	createPassword,
} from '../controllers/authentication';
import staffs from '../controllers/staffs';
import transactions from '../controllers/transactions';
import utilityTransactions from '../controllers/utilityTransactions';
import withdrawals from '../controllers/withdrawals';
import { checkBalance, verifyPin } from '../helpers/middlewares';
import staffRouteValidation from '../validate/staffs';
import businessRoutes from './business';

const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE
routes.get('/', (req, res) => {
	return res.status(200).send('API Working WEll');
});

// routes.post('/register', staffRouteValidation('/register'), register);
routes.post('/login', staffRouteValidation('/login'), preLogin);
routes.post('/resend-otp', staffRouteValidation('/resend-otp'), resendOtp);
routes.post('/update-password', staffRouteValidation('/update-password'), updatePassword);
routes.post('/reset-password', staffRouteValidation('/reset-password'), resetPassword);
routes.post('/set-trans-pin', staffRouteValidation('/set-trans-pin'), setTransPin);
routes.post('/create-password', staffRouteValidation('/create-password'), createPassword);
routes.post('/change-password', staffRouteValidation('/change-password'), changePassword);
routes.post('/get-user-businesses/:email', changePassword);
routes.post('/verify-otp', staffRouteValidation('/verify-otp'), verifyOtp);
routes.post('/update-staff-settings', staffRouteValidation('/update-staff-settings'), updateStaffSettings);
routes.post('/update-staff-profile', staffRouteValidation('/update-staff-profile'), updateStaffProfile);
routes.get('/get-staff-data', getStaffData);
routes.get('/get-dashboard-data', staffs.staffDashboard);

routes.post('/utility/purchase/:type', staffRouteValidation('/utility/purchase'), verifyPin, checkBalance, utilityTransactions.purchaseUtility);
routes.get('/utility/get-variation-codes/:serviceId', staffRouteValidation('/utility/get-variation-codes'), utilityTransactions.getVariationCodes);
routes.post('/utility/verify-merchant', staffRouteValidation('/utility/verify-merchant'), utilityTransactions.verifyMerchant);

routes.get('/transactions', transactions.getTransactions);
routes.get('/transaction/get-details/:id', transactions.getTransactionDetails);
routes.post('/transaction/name-enquiry', transactions.nameEnquiry);
routes.get('/transaction/get-banks', transactions.getBanks);
routes.post('/transaction/withdraw', verifyPin, checkBalance, withdrawals.payouts);
routes.post('/transaction/verify-pin', withdrawals.verifyPin);

routes.use('/business', businessRoutes);

export default routes;

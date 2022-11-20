// Import packages
import { Router } from 'express';

// Import function files
import business from '../controllers/business';
import staff from '../controllers/staffs';
import settings from '../controllers/settings';
import businessRouteValidation from '../validate/business';
import staffRouteValidation from '../validate/staffs';
import { isAdmin, isAuthorized } from '../helpers/middlewares';
import { AdminRoles } from '../helpers/types';
// import staffsRoutes from './staffs';

const router = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE
router.get('/', (req, res) => {
	return res.status(200).send('Business API Working');
});

router.post('/register', businessRouteValidation('/register'), business.createEmployer);
router.post('/login', businessRouteValidation('/login'), business.login);
router.post('/resend-otp', businessRouteValidation('/resend-otp'), business.resendOtp);
router.post('/verify-otp', businessRouteValidation('/verify-otp'), business.verifyOtp);
router.get('/stats/', isAuthorized, business.getStats);
router.get('/me/', isAuthorized, business.me);

router.post('/verify/rc', isAuthorized, businessRouteValidation('/verify/rc'), business.verify);
router.post('/verify/tin', isAuthorized, businessRouteValidation('/verify/tin'), business.verify);

router.post('/create-staff', isAuthorized, staffRouteValidation('/register'), staff.createStaff);
router.get('/staffs', isAuthorized, business.getStaffs);
router.post('/toggle/:staffId', isAuthorized, staffRouteValidation('/business/toggle/:staffId'), staff.toggleStaff);

router.post('/forget-password', businessRouteValidation('/forget-password'), business.forgetPassword);
router.post('/reset-password', businessRouteValidation('/reset-password'), business.resetPassword);
router.post('/change-password', businessRouteValidation('/change-password'), business.updatePassword);

router.patch('/update-profile', isAuthorized, businessRouteValidation('/update-profile'), business.updateBusiness);

router.get('/payment-history', isAuthorized, business.getPaymentHistory);
router.get('/get-invoices', isAuthorized, business.getInvoices);
router.get('/get-payment-account', isAuthorized, business.getPaymentAccount);
// router.get('/pay', isAuthorized, businessRouteValidation('/pay'), business.pay);

export default router;

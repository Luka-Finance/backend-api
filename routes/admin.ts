// Import packages
import { Router } from 'express';

// Import function files
import admin from '../controllers/admin';
import settings from '../controllers/settings';
import staffRouteValidation from '../validate/staffs';
import adminRouteValidation from '../validate/admins';
import { isAdmin } from '../helpers/middlewares';
import { AdminRoles } from '../helpers/types';

const router = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE
router.get('/', (req, res) => {
	return res.status(200).send('API Working');
});

router.post('/register', isAdmin([AdminRoles.CONTROL]), staffRouteValidation('/register'), admin.register);
router.post('/login', staffRouteValidation('/login'), admin.login);
router.post('/update-password', staffRouteValidation('/update-password'), admin.updatePassword);
router.post('/reset-password', staffRouteValidation('/reset-password'), admin.resetPassword);
router.post('/change-password', staffRouteValidation('/change-password'), admin.changePassword);
router.get('/get-admins', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), admin.getAdmins);
router.get('/get-admin-details/:id', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), staffRouteValidation('id'), admin.getAdminDetails);
router.post('/update-admin-status/:id', isAdmin([AdminRoles.CONTROL]), staffRouteValidation('/update/status'), admin.updateAdminStatus);
router.get('/get-users', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), admin.getUsers);
router.get('/get-user-details/:id', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), staffRouteValidation('id'), admin.getUserDetails);
router.post(
	'/update-user-status/:id',
	isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]),
	staffRouteValidation('/update/status'),
	admin.updateUserStatus
);

// router.get('/documents', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), documents.getDocuments);
// router.get('/document/get-details/:id', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), documents.getDocumentDetails);
// router.get('/document/delete/:id', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), documents.deleteDocument);

router.get('/settings', isAdmin([AdminRoles.CONTROL, AdminRoles.SUPPORT]), settings.getSettings);
router.post('/settings/create', isAdmin([AdminRoles.CONTROL]), settings.createSetting);
router.post('/settings/update/:id', isAdmin([AdminRoles.CONTROL]), settings.updateSetting);
router.get('/settings/delete/:id', isAdmin([AdminRoles.CONTROL]), settings.deleteSetting);

export default router;

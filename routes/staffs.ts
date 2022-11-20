// // Import packages
// import { Router } from 'express';

// // Import function files
// import business from '../controllers/business';
// import businessRouteValidation from '../validate/business';
// import staffRouteValidation from '../validate/staffs';
// import staffController from '../controllers/staffs';

// const router = Router();

// /*************************************************************************
// API CALL START
// *************************************************************************/

// // INDEX ROUTE TO SHOW API IS WORKING FINE

// // business deactivate a staff
// router.post('/toggle/:staffId', staffRouteValidation('/staffs/toggle/:staffId'), staffController.toggleStaff);

// router.get('/', (req, res) => {
// 	return res.status(200).send('Staff API Working');
// });

// export default router;

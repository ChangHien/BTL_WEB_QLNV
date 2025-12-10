import express from 'express';
import * as nhanVienController from '../controllers/nhanVienController.js';


import { verifyToken } from '../middleware/authMiddleware.js'; 


import roleMiddleware from '../middleware/roleMiddleware.js'; 
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();


router.use(verifyToken);


const adminHrOnly = roleMiddleware([ROLES.ADMIN, ROLES.HR]);
const allowAll = roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]);


router.post('/', adminHrOnly, nhanVienController.create);


router.get('/', adminHrOnly, nhanVienController.findAll);


router.get('/:ma_nv', allowAll, nhanVienController.findOne);


router.put('/:ma_nv', adminHrOnly, nhanVienController.update);
router.delete('/:ma_nv', adminHrOnly, nhanVienController.remove);

export default router;
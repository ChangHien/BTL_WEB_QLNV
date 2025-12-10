import express from 'express';
import * as controller from '../controllers/chamCongController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/check-in', verifyToken, controller.checkIn);
router.put('/check-out', verifyToken, controller.checkOut);


router.get('/', verifyToken, isManager, controller.getDanhSach); 


router.put('/:id', verifyToken, isManager, controller.updateTrangThaiChuanCan);


router.get('/:ma_nv', verifyToken, controller.getHistory);


router.get('/summary', verifyToken, isManager, controller.getAll);

export default router;
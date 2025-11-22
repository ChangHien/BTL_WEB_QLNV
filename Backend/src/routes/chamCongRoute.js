import express from 'express';
import * as chamCongController from '../controllers/chamCongController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

router.use(authMiddleware);

// POST /api/chamcong/ghi-nhan
router.post(
  '/ghi-nhan', 
  roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]),
  chamCongController.ghiNhanChamCong
);

// GET /api/chamcong/:ma_nv/:thang/:nam
// Lấy lịch sử chấm công (NV xem của mình, HR/Admin xem của mọi người)
router.get(
  '/:ma_nv/:thang/:nam', 
  roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]),
  chamCongController.getLichSuChamCong
);

export default router;
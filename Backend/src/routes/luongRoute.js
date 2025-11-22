import express from 'express';
import * as luongController from '../controllers/luongController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

router.use(authMiddleware);

// [POST] Tính lương cho nhân viên/tháng cụ thể (Chỉ Admin/HR)
router.post(
  '/tinh-luong',
  roleMiddleware([ROLES.ADMIN, ROLES.HR]),
  luongController.tinhLuongThang
);

// [GET] Thống kê thu nhập năm (Admin/HR có thể xem của mọi người, NV chỉ xem của mình)
router.get(
  '/thong-ke/:ma_nv/:nam',
  roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]),
  luongController.thongKeThuNhapNam
);

export default router;
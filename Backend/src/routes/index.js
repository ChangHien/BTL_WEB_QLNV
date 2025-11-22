import express from 'express';
const router = express.Router();

import authRoutes from './authRoute.js';
import nhanVienRoutes from './nhanVienRoute.js';
import luongRoutes from './luongRoute.js';
import chamCongRoutes from './chamCongRoute.js'; 

router.use('/auth', authRoutes);
router.use('/nhanvien', nhanVienRoutes);


router.use('/luong', luongRoutes);
router.use('/chamcong', chamCongRoutes); 

export default router;
import * as luongService from '../services/luongService.js';
import db from '../models/index.js';

export const tinhLuongThang = async (req, res) => {
    const { ma_nhan_vien, thang, nam, ma_phong, ma_chuc_vu } = req.body; 

    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu thông tin (thang, nam)." });
    }
    try {
        if (ma_nhan_vien) {
            const result = await luongService.tinhToanVaLuuBangLuong(ma_nhan_vien, thang, nam);
            return res.send({ 
                message: `Tính lương thành công cho NV ${ma_nhan_vien}.`,
                data: result
            });
        }

        // CASE 2: Tính cho NHIỀU NGƯỜI (Batch)
        const whereCondition = { trang_thai: 'DangLam' };
        if (ma_phong) whereCondition.ma_phong = ma_phong;
        if (ma_chuc_vu) whereCondition.ma_chuc_vu = ma_chuc_vu;

        const listNV = await db.NhanVien.findAll({
            where: whereCondition,
            attributes: ['ma_nhan_vien']
        });

        let successCount = 0;
        for (const nv of listNV) {
            try {
                await luongService.tinhToanVaLuuBangLuong(nv.ma_nhan_vien, thang, nam);
                successCount++;
            } catch (e) { console.warn(`Lỗi tính lương NV ${nv.ma_nhan_vien}`); }
        }

        res.send({ message: `Hoàn tất! Đã tính lương cho ${successCount} nhân viên.` });

    } catch (error) {
        res.status(500).send({ message: "Lỗi hệ thống: " + error.message });
    }
};


// GET /api/luong/thong-ke/:ma_nv/:nam
 
export const thongKeThuNhapNam = async (req, res) => {
    const { ma_nv, nam } = req.params;
    const userRole = req.userRole; 
    const currentUserId = req.userId; 

    try {
        // GỌI SERVICE, TRUYỀN THÔNG TIN BẢO MẬT ĐỂ PHÂN QUYỀN TRUY CẬP
        const result = await luongService.getThongKeNam(ma_nv, nam, userRole, currentUserId);
        
        // Xử lý trường hợp phân quyền từ chối
        if (result.error === 403) {
             return res.status(403).send({ message: result.message });
        }

        if (result.chi_tiet_theo_thang.length === 0) {
            return res.status(404).send({ message: "Không tìm thấy dữ liệu lương trong năm này." });
        }
        
        res.send(result);

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi thống kê thu nhập: " + error.message });
    }
};
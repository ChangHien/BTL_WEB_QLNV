import * as luongService from '../services/luongService.js';
import db from '../models/index.js';

//POST /api/luong/tinh-luong
 
export const tinhLuongThang = async (req, res) => {
    const { ma_nhan_vien, thang, nam } = req.body; 

    if (!ma_nhan_vien || !thang || !nam) {
        return res.status(400).send({ message: "Thiếu thông tin (ma_nhan_vien, thang, nam)." });
    }

    try {
        const result = await luongService.tinhToanVaLuuBangLuong(ma_nhan_vien, thang, nam);
        res.send({ 
            message: ` Tính lương thành công cho NV ${ma_nhan_vien} tháng ${thang}/${nam}.`,
            data: result
        });
    } catch (error) {
        res.status(500).send({ 
            message: " Lỗi khi tính lương: " + error.message 
        });
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
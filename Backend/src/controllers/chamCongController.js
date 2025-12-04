import * as chamCongService from '../services/chamCongService.js';
import db from '../models/index.js';
import moment from 'moment';

const ChamCong = db.ChamCong;

export const checkIn = async (req, res) => {
    let { ma_nhan_vien, ngay_lam, gio_vao } = req.body;

    if (!ngay_lam) {
        ngay_lam = moment().format('YYYY-MM-DD');
    }
    
    if (!ma_nhan_vien || !gio_vao) {
        return res.status(400).send({ message: "Thiếu mã nhân viên hoặc giờ vào." });
    }

    try {
        // Gọi Service tạo bản ghi mới (gio_ra = null, trang_thai_ca = 'DangLam')
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien, ngay_lam, gio_vao, null 
        );

        res.status(201).send({ 
            message: "Check-in thành công! Đang chờ Check-out.", 
            data: newRecord 
        });

    } catch (error) {
        if (error.message.includes("Giờ làm đã ghi nhận bị chồng lấn")) {
             return res.status(400).send({ message: "Đã có ca làm đang diễn ra. Vui lòng Check-out trước." });
        }
        res.status(500).send({ message: "Lỗi Check-in: " + error.message });
    }
};

export const checkOut = async (req, res) => {
    let { ma_nhan_vien, ngay_lam, gio_ra } = req.body;

    if (!ngay_lam) {
        ngay_lam = moment().format('YYYY-MM-DD');
    }

    if (!ma_nhan_vien || !gio_ra) {
        return res.status(400).send({ message: "Thiếu mã nhân viên hoặc giờ ra." });
    }

    try {
        // Gọi Service cập nhật gio_ra và tính toán chuyên cần
        const updatedRecord = await chamCongService.updateGioRaAndCheckChuyenCan(
            ma_nhan_vien, ngay_lam, gio_ra
        );
        
        res.send({ 
            message: `Check-out thành công. Trạng thái ca: ${updatedRecord.trang_thai_ca}`, 
            data: updatedRecord 
        });

    } catch (error) {
        if (error.message.includes("Không tìm thấy bản ghi Check-in chưa kết thúc")) {
            return res.status(404).send({ message: "Không tìm thấy ca làm đang hoạt động để Check-out." });
        }
        res.status(500).send({ message: "Lỗi Check-out: " + error.message });
    }
};

// CHỨC NĂNG 3: HR GHI NHẬN CA LÀM HOÀN CHỈNH (POST /api/chamcong/full)

export const createFullChamCong = async (req, res) => {
    let { ma_nhan_vien, ngay_lam, gio_vao, gio_ra } = req.body;

    if (!ngay_lam) {
        ngay_lam = moment().format('YYYY-MM-DD');
    }
    
    // Kiểm tra giờ ra phải lớn hơn giờ vào
    if (moment(gio_vao, 'HH:mm:ss').isSameOrAfter(moment(gio_ra, 'HH:mm:ss'))) {
        return res.status(400).send({ message: "Giờ ra phải sau giờ vào." });
    }

    try {
        // Gọi Service tạo bản ghi, Service sẽ tự động tính trạng thái
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien, ngay_lam, gio_vao, gio_ra
        );

        res.status(201).send({ 
            message: `Ghi nhận chấm công (hoàn chỉnh) thành công! Trạng thái: ${newRecord.trang_thai_ca}`, 
            data: newRecord 
        });

    } catch (error) {
        if (error.message.includes("Giờ làm đã ghi nhận bị chồng lấn")) {
             return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: "Lỗi khi ghi nhận ca làm: " + error.message });
    }
};

//Lấy lịch sử chấm công của 1 nv theo tháng/năm.

export const getHistory = async (req, res) => {
    const { ma_nv } = req.params;
    const { thang, nam } = req.query; 
    const userRole = req.userRole; 
    const currentUserId = req.userId;
    
    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu tham số tháng và năm." });
    }
    try {
        const result = await chamCongService.getChamCongByMaNv(
            ma_nv, parseInt(thang), parseInt(nam), userRole, currentUserId 
        );
        
        // Xử lý phân quyền (logic đã có trong service)
        if (result.error === 403) {
             return res.status(403).send({ message: result.message });
        }

        if (result.records.length === 0) {
            return res.status(404).send({ message: `Không tìm thấy lịch sử chấm công tháng ${thang}/${nam}.` });
        }
        
        res.send({ 
            message: "Lấy lịch sử chấm công thành công.", 
            data: result.records 
        });
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi lấy lịch sử chấm công: " + error.message });
    }
};
// ds chuyên cần all nv 
export const getAll = async (req, res) => {
    const { thang, nam } = req.query;

    if (!thang || !nam) {
        return res.status(400).send({ message: "Thiếu tham số tháng và năm." });
    }

    try {
        // Gọi Service để lấy dữ liệu tổng hợp (chỉ trả về 4 trạng thái thống kê)
        const summaryCounts = await chamCongService.getAllChamCongSummary(
            parseInt(thang), 
            parseInt(nam)
        );

        res.send({ 
            message: `Lấy báo cáo tổng hợp nhân viên theo 4 trạng thái chuyên cần tháng ${thang}/${nam} thành công.`, 
            // data giờ chỉ chứa đối tượng tổng hợp (vd: { "DungGio": 55, "DiMuon": 12, ...})
            data: summaryCounts
        });
    } catch (error) {
        console.error("Lỗi Controller getAll:", error);
        res.status(500).send({ message: "Lỗi khi lấy báo cáo chuyên cần: " + error.message });
    }
};
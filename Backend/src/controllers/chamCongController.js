import * as chamCongService from '../services/chamCongService.js';
import db from '../models/index.js';
import moment from 'moment';

const ChamCong = db.ChamCong;

// POST /api/chamcong/ghi-nhan Ghi nhận ca làm (cả check-in và check-out)
export const ghiNhanChamCong = async (req, res) => {
    let { ma_nhan_vien, ngay_lam, gio_vao, gio_ra } = req.body;

    // Nếu không có ngày làm, lấy ngày hiện tại
    if (!ngay_lam) {
        ngay_lam = moment().format('YYYY-MM-DD');
    }
    
    if (!ma_nhan_vien || !gio_vao || !gio_ra) {
        return res.status(400).send({ message: "Thiếu thông tin giờ vào/giờ ra/mã nhân viên." });
    }
    
    // Kiểm tra giờ ra phải lớn hơn giờ vào
    if (moment(gio_vao, 'HH:mm:ss').isSameOrAfter(moment(gio_ra, 'HH:mm:ss'))) {
        return res.status(400).send({ message: "Giờ ra phải sau giờ vào." });
    }

    try {
        const newRecord = await chamCongService.createChamCongRecord(
            ma_nhan_vien, ngay_lam, gio_vao, gio_ra
        );

        res.status(201).send({ 
            message: "Ghi nhận chấm công thành công!", 
            data: newRecord 
        });

    } catch (error) {
        if (error.message.includes("Giờ làm đã ghi nhận bị chồng lấn")) {
             return res.status(400).send({ message: error.message });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).send({ message: "Đã có bản ghi chấm công cho ngày này. Hãy sử dụng chức năng cập nhật." });
        }
        res.status(500).send({ message: " Lỗi khi ghi nhận chấm công: " + error.message });
    }
};

// GET /api/chamcong/:ma_nv/:thang/:nam ,Lấy lịch sử chấm công

export const getLichSuChamCong = async (req, res) => {
    const { ma_nv, thang, nam } = req.params;
    const userRole = req.userRole; 
    const currentUserId = req.userId;
    
    try {
        const result = await chamCongService.getChamCongByMaNv(
            ma_nv, parseInt(thang), parseInt(nam), userRole, currentUserId 
        );
        // xu li phan quyen
        if (result.error === 403) {
             return res.status(403).send({ message: result.message });
        }

        if (result.records.length === 0) {
            return res.status(404).send({ message: `Không tìm thấy lịch sử chấm công tháng ${thang}/${nam}.` });
        }
        
        res.send({ 
            message: " Lấy lịch sử chấm công thành công.", 
            data: result.records 
        });
    } catch (error) {
        res.status(500).send({ message: " Lỗi khi lấy lịch sử chấm công: " + error.message });
    }
};
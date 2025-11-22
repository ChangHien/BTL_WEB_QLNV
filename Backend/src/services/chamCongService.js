import db from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import {ROLES} from '../config/constantConfig.js';

const ChamCong = db.ChamCong;

/**
 * Kiểm tra xem ca làm mới có bị chồng lấn với bất kỳ ca làm nào đã ghi nhận trong ngày không.
 * Giả định: Người dùng sẽ gửi cả gio_vao và gio_ra.
 */
export const checkOverlappingTime = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    // 2. Tìm các ca làm khác của nhân viên này trong cùng ngày
    const overlappingRecord = await ChamCong.findOne({
        where: {
            ma_nhan_vien,
            ngay_lam,
            // Logic kiểm tra chồng lấn
            [Op.and]: [
                { gio_vao: { [Op.lt]: gio_ra} }, 
                { gio_ra: { [Op.gt]: gio_vao } } 
            ]
        }
    });

    return !!overlappingRecord; 
};

// Ghi nhận ca làm mới (Check-in/Check-out)

export const createChamCongRecord = async (ma_nhan_vien, ngay_lam, gio_vao, gio_ra) => {
    // Nếu có gio_ra, kiểm tra chồng lấn
    if (gio_ra) {
        const isOverlapping = await checkOverlappingTime(ma_nhan_vien, ngay_lam, gio_vao, gio_ra);
        if (isOverlapping) {
            throw new Error("Giờ làm đã ghi nhận bị chồng lấn.");
        }
    }
    
    // Ghi nhận vào DB
    return await ChamCong.create({
        ma_nhan_vien,
        ngay_lam,
        gio_vao,
        gio_ra
    });
};

// Lấy lịch sử chấm công theo ngày/tháng

export const getChamCongByMaNv = async (ma_nhan_vien, thang, nam, userRole, currentUserId) => {
    if (userRole === ROLES.NHAN_VIEN && ma_nhan_vien !== currentUserId) {
        return { 
            error: 403, 
            message: "Bạn không có quyền xem lịch sử chấm công của nhân viên khác." 
        };
    }
    
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');

    const records = await ChamCong.findAll({
        where: {
            ma_nhan_vien,
            ngay_lam: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [['ngay_lam', 'ASC']]
    });
    
    return { records: records }; 
};
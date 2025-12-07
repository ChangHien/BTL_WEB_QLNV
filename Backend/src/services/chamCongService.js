import db from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import {ROLES, TRANG_THAI_CHUYEN_CAN, GIO_VAO_CHUAN, GIO_RA_CHUAN, NGUONG_DI_MUON_PHUT, NGUONG_VE_SOM_PHUT} from '../config/constantConfig.js';

const ChamCong = db.ChamCong;
const NhanVien = db.NhanVien;
const ChucVu = db.ChucVu;
/**
 * Hàm nội bộ để xác định trạng thái chuyên cần (Đi muộn, Về sớm, Đúng giờ)
 * @param {string} gioVao Thực tế
 * @param {string} gioRa Thực tế
 * @returns {string} Trạng thái chuyên cần
 */
function tinhTrangThaiChuyenCan(gioVao, gioRa) {
    const gioVaoThucTe = moment(gioVao, 'HH:mm:ss');
    const gioRaThucTe = moment(gioRa, 'HH:mm:ss');
    
    const gioVaoChuan = moment(GIO_VAO_CHUAN, 'HH:mm:ss');
    const gioRaChuan = moment(GIO_RA_CHUAN, 'HH:mm:ss');

    let trangThai = TRANG_THAI_CHUYEN_CAN.DUNG_GIO;

    // 1. Kiểm tra Đi muộn
    const diffVaoPhut = gioVaoThucTe.diff(gioVaoChuan, 'minutes');
    if (diffVaoPhut > NGUONG_DI_MUON_PHUT) {
        trangThai = TRANG_THAI_CHUYEN_CAN.DI_MUON;
    }

    // 2. Kiểm tra Về sớm
    const diffRaPhut = gioRaChuan.diff(gioRaThucTe, 'minutes');
    if (diffRaPhut > NGUONG_VE_SOM_PHUT) {
        if (trangThai === TRANG_THAI_CHUYEN_CAN.DUNG_GIO) {
            trangThai = TRANG_THAI_CHUYEN_CAN.VE_SOM;
        }
    }

    return trangThai;
}
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

export const createChamCongRecord = async (ma_nhan_vien, ngay_lam = null, gio_vao = null, gio_ra = null) => {

    // Nếu HR truyền đầy đủ giờ
    const isFullMode = gio_vao !== null && gio_ra !== null;

    // Nếu không truyền ngày, tự lấy ngày server
    if (!ngay_lam) {
        ngay_lam = moment().format('YYYY-MM-DD');
    }

    // ⬅ CASE 1: Check-in (không truyền giờ)
    if (!isFullMode) {

        // Giờ vào = giờ thực server
        gio_vao = moment().format('HH:mm:ss');

        // Check đã check-in hôm nay chưa
        const existing = await ChamCong.findOne({
            where: { ma_nhan_vien, ngay_lam, gio_ra: null }
        });

        if (existing) {
            throw new Error("Bạn đã check-in rồi và chưa check-out.");
        }

        return await ChamCong.create({
            ma_nhan_vien,
            ngay_lam,
            gio_vao,
            gio_ra: null,
            trang_thai_ca: TRANG_THAI_CHUYEN_CAN.DANG_LAM
        });
    }

    // ⬅ CASE 2: HR tạo full ca
    const isOverlap = await checkOverlappingTime(ma_nhan_vien, ngay_lam, gio_vao, gio_ra);
    if (isOverlap) {
        throw new Error("Giờ làm đã ghi nhận bị chồng lấn với ca khác.");
    }

    const trang_thai = tinhTrangThaiChuyenCan(gio_vao, gio_ra);

    return await ChamCong.create({
        ma_nhan_vien,
        ngay_lam,
        gio_vao,
        gio_ra,
        trang_thai_ca: trang_thai
    });
};

/**
 * 🎯 Check-out – dùng giờ thực tế của server
 */
export const updateGioRaAndCheckChuyenCan = async (ma_nhan_vien) => {
    const ngay_lam = moment().format('YYYY-MM-DD');
    const gio_ra = moment().format('HH:mm:ss'); // ⬅ LẤY GIỜ THỰC

    // Tìm bản ghi check-in chưa đóng
    const record = await ChamCong.findOne({
        where: { ma_nhan_vien, ngay_lam, gio_ra: null }
    });

    if (!record) {
        throw new Error("Không tìm thấy bản ghi Check-in để Check-out.");
    }

    const gio_vao = record.gio_vao;

    // check out phải sau check in
    if (moment(gio_ra, 'HH:mm:ss').isBefore(moment(gio_vao, 'HH:mm:ss'))) {
        throw new Error("Giờ ra không hợp lệ.");
    }

    const trang_thai_moi = tinhTrangThaiChuyenCan(gio_vao, gio_ra);

    await record.update({
        gio_ra,
        trang_thai_ca: trang_thai_moi
    });

    return record;
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
/**
 * ds trả về tổng sl nv theo trạng thái cc
 * @param {number} thang
 * @param {number} nam
 * @returns {Object} 
 */
export const getAllChamCongSummary = async (thang, nam) => {
    const startDate = moment([nam, thang - 1]).startOf('month').format('YYYY-MM-DD');
    const endDate = moment([nam, thang - 1]).endOf('month').format('YYYY-MM-DD');
    const records = await ChamCong.findAll({
        attributes: ['ma_nhan_vien', 'trang_thai_ca'], 
        where: {
            ngay_lam: {
                [Op.between]: [startDate, endDate]
            }
        },
        raw: true
    });

    const uniqueEmployeesByStatus = {
        [TRANG_THAI_CHUYEN_CAN.DUNG_GIO]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.DI_MUON]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.VE_SOM]: new Set(),
        [TRANG_THAI_CHUYEN_CAN.NGHI_PHEP]: new Set(),
    };
    records.forEach(record => {
        const maNv = record.ma_nhan_vien;
        const trangThai = record.trang_thai_ca;

        if (uniqueEmployeesByStatus[trangThai]) {
            uniqueEmployeesByStatus[trangThai].add(maNv);
        }
    });

    // 4. Chuyển đổi Set sang số đếm
    const globalEmployeeCounts = {};
    for (const [status, employeesSet] of Object.entries(uniqueEmployeesByStatus)) {
        globalEmployeeCounts[status] = employeesSet.size;
    }

    return globalEmployeeCounts;
};
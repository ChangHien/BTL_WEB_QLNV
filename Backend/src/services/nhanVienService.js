import db from '../models/index.js';

const NhanVien = db.NhanVien;
const TaiKhoan = db.TaiKhoan;
const { Op } = db.Sequelize;

export const generateMaNhanVien = async (ma_phong, ma_chuc_vu) => {
  const prefix = ma_phong + ma_chuc_vu; 

  const lastNhanVien = await NhanVien.findOne({
    where: { 
      ma_nhan_vien: { [Op.like]: `${prefix}%` }
    },
    order: [['ma_nhan_vien', 'DESC']]
  });

  let nextOrder = 1;
  if (lastNhanVien) {
    const lastMa = lastNhanVien.ma_nhan_vien;
    const lastOrderStr = lastMa.substring(prefix.length); 
    nextOrder = parseInt(lastOrderStr, 10) + 1;
  }

  const nextOrderStr = String(nextOrder).padStart(3, '0');
  return prefix + nextOrderStr; 
};

export const getAllNhanVien = async () => {
    return await NhanVien.findAll({
        include: [
            { model: db.PhongBan, as: 'phongBan', attributes: ['ten_phong'] },
            { model: db.ChucVu, as: 'chucVu', attributes: ['ten_chuc_vu'] }
        ]
    });
};

export const getNhanVienById = async (ma_nhan_vien) => {
    return await NhanVien.findByPk(ma_nhan_vien, {
        include: [
            { model: db.PhongBan, as: 'phongBan', attributes: ['ten_phong'] },
            { model: db.ChucVu, as: 'chucVu', attributes: ['ten_chuc_vu'] }
        ]
    });
};

export const createNhanVien = async (data) => {
    const ma_nhan_vien = await generateMaNhanVien(data.ma_phong, data.ma_chuc_vu);
    
    return await NhanVien.create({
        ...data,
        ma_nhan_vien
    });
};

export const updateNhanVien = async (ma_nhan_vien, data) => {
    const nhanVienHienTai = await NhanVien.findByPk(ma_nhan_vien);
    
    if (!nhanVienHienTai) {
        throw new Error(`Không tìm thấy nhân viên với mã ${ma_nhan_vien}`);
    }

    const phongBanThayDoi = data.ma_phong && data.ma_phong !== nhanVienHienTai.ma_phong;
    const chucVuThayDoi = data.ma_chuc_vu && data.ma_chuc_vu !== nhanVienHienTai.ma_chuc_vu;
    const luongCoBanThayDoi = data.muc_luong_co_ban && data.muc_luong_co_ban !== nhanVienHienTai.muc_luong_co_ban;

    return await db.sequelize.transaction(async (t) => {
        if (phongBanThayDoi || chucVuThayDoi) {
            const ma_phong_moi = data.ma_phong || nhanVienHienTai.ma_phong;
            const ma_chuc_vu_moi = data.ma_chuc_vu || nhanVienHienTai.ma_chuc_vu;
            
            const ma_nhan_vien_moi = await generateMaNhanVien(ma_phong_moi, ma_chuc_vu_moi);
            
            await NhanVien.update(
                { ...data, ma_nhan_vien: ma_nhan_vien_moi },
                { where: { ma_nhan_vien }, transaction: t }
            );

            await TaiKhoan.update(
                { ma_nhan_vien: ma_nhan_vien_moi },
                { where: { ma_nhan_vien }, transaction: t }
            );

            await db.ChamCong.update(
                { ma_nhan_vien: ma_nhan_vien_moi },
                { where: { ma_nhan_vien }, transaction: t }
            );

            await db.BangLuong.update(
                { ma_nhan_vien: ma_nhan_vien_moi },
                { where: { ma_nhan_vien }, transaction: t }
            );
        } else {
            await NhanVien.update(data, {
                where: { ma_nhan_vien },
                transaction: t
            });
        }

        if (luongCoBanThayDoi) {
            const bangLuongList = await db.BangLuong.findAll({
                where: { ma_nhan_vien },
                transaction: t
            });

            for (const bangLuong of bangLuongList) {
                const tongGioLam = parseFloat(bangLuong.tong_gio_lam);
                const luongCoBanMoi = parseFloat(data.muc_luong_co_ban);
                const luongCoBanCu = parseFloat(nhanVienHienTai.muc_luong_co_ban);
                
                const GIO_LAM_CHUAN_THANG = 160;
                const HE_SO_LAM_THEM_GIO = 1.5;
                
                const luongCoBanTheoGio = luongCoBanMoi / GIO_LAM_CHUAN_THANG;
                const luongCoBanTheoGioCu = luongCoBanCu / GIO_LAM_CHUAN_THANG;
                
                let luongThemGioMoi = 0;
                let tongLuongMoi = 0;

                if (tongGioLam === 0) {
                    tongLuongMoi = 0;
                } 
                else if (tongGioLam < GIO_LAM_CHUAN_THANG) {
                    tongLuongMoi = luongCoBanTheoGio * tongGioLam;
                } 
                else if (tongGioLam === GIO_LAM_CHUAN_THANG) {
                    tongLuongMoi = luongCoBanMoi;
                } 
                else {
                    const gioLamThem = tongGioLam - GIO_LAM_CHUAN_THANG;
                    luongThemGioMoi = gioLamThem * luongCoBanTheoGio * HE_SO_LAM_THEM_GIO;
                    tongLuongMoi = luongCoBanMoi + luongThemGioMoi;
                }

                await bangLuong.update({
                    luong_co_ban: luongCoBanMoi.toFixed(2),
                    luong_them_gio: luongThemGioMoi.toFixed(2),
                    tong_luong: tongLuongMoi.toFixed(2)
                }, { transaction: t });
            }
        }

        return 1;
    });
};

export const deleteNhanVien = async (ma_nhan_vien) => {
    return await db.sequelize.transaction(async (t) => {
        await TaiKhoan.destroy({ where: { ma_nhan_vien }, transaction: t });

        const deletedRows = await NhanVien.destroy({
            where: { ma_nhan_vien },
            transaction: t
        });
        return deletedRows;
    });
};
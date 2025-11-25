import db from "../models/index.js";

const ALLOWED_STATUS = ["HoatDong", "NgungHoatDong"];

// Chuẩn hóa mã: trim & đổi sang uppercase để ghi thống nhất
const normalizeCode = (value) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";

// Chuẩn hóa chuỗi thông thường (giữ nguyên hoa/thường)
const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizeYear = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const year = Number(value);
  return Number.isNaN(year) ? null : year;
};

// mã phòng phải đúng 3 ký tự chữ hoặc số
const isValidPhongCode = (value) => /^[A-Za-z0-9]{3}$/.test(value || "");

const isValidStatus = (value) => ALLOWED_STATUS.includes(value);

export const listPhongBans = async () =>
  db.PhongBan.findAll({
    order: [["ma_phong", "ASC"]],
    raw: true,
  });

export const findPhongBanByMa = async (maPhong) =>
  db.PhongBan.findOne({
    where: { ma_phong: normalizeCode(maPhong) },
    raw: true,
  });

export const createPhongBan = async (payload = {}) => {
  const maPhong = normalizeCode(payload.ma_phong || "");
  const exists = await db.PhongBan.findOne({
    where: { ma_phong: maPhong },
    raw: true,
  });
  if (exists) {
    return { error: "ma_phong đã tồn tại", status: 409 };
  }
  if (!maPhong) {
    return { error: "ma_phong không hợp lệ", status: 400 };
  }
  if (!isValidPhongCode(maPhong)) {
    return {
      error: "ma_phong phải gồm đúng 3 ký tự chữ hoặc số",
      status: 400,
    };
  }
  const tenPhong = normalizeString(payload.ten_phong || "");
  if (!tenPhong) {
    return { error: "ten_phong không hợp lệ", status: 400 };
  }
  const namThanhLap = normalizeYear(payload.nam_thanh_lap);
  if (
    namThanhLap !== null &&
    (!Number.isInteger(namThanhLap) || namThanhLap < 1900 || namThanhLap > 9999)
  ) {
    return {
      error: "nam_thanh_lap phải là năm hợp lệ (1900-9999)",
      status: 400,
    };
  }
  const rawTrangThai = (payload.trang_thai || "").trim();
  const trangThai = rawTrangThai || "HoatDong";
  if (!isValidStatus(trangThai)) {
    return {
      error: "trang_thai chỉ chấp nhận HoatDong hoặc NgungHoatDong",
      status: 400,
    };
  }
  const created = await db.PhongBan.create({
    ma_phong: maPhong,
    ten_phong: tenPhong,
    nam_thanh_lap: namThanhLap,
    trang_thai: trangThai,
  });
  return { data: created.get({ plain: true }) };
};

export const updatePhongBan = async (maPhong, updates) => {
  const record = await db.PhongBan.findByPk(normalizeCode(maPhong));
  if (!record) {
    return { error: "Phòng ban không tồn tại", status: 404 };
  }
  const safeUpdates = { ...updates };
  delete safeUpdates.ma_phong;
  if (safeUpdates.ten_phong !== undefined) {
    const next = normalizeString(safeUpdates.ten_phong || "");
    if (!next) {
      return { error: "ten_phong không hợp lệ", status: 400 };
    }
    safeUpdates.ten_phong = next;
  }
  if (safeUpdates.trang_thai !== undefined) {
    const trangThai = (safeUpdates.trang_thai || "").trim();
    if (!trangThai) {
      delete safeUpdates.trang_thai;
    } else if (!isValidStatus(trangThai)) {
      return {
        error: "trang_thai chỉ chấp nhận HoatDong hoặc NgungHoatDong",
        status: 400,
      };
    } else {
      safeUpdates.trang_thai = trangThai;
    }
  }
  if (safeUpdates.nam_thanh_lap !== undefined) {
    const nextYear = normalizeYear(safeUpdates.nam_thanh_lap);
    if (
      nextYear !== null &&
      (!Number.isInteger(nextYear) || nextYear < 1900 || nextYear > 9999)
    ) {
      return {
        error: "nam_thanh_lap phải là năm hợp lệ (1900-9999)",
        status: 400,
      };
    }
    safeUpdates.nam_thanh_lap = nextYear;
  }
  await record.update(safeUpdates);
  const refreshed = await db.PhongBan.findByPk(record.ma_phong, {
    raw: true,
  });
  return { data: refreshed };
};

export const deletePhongBan = async (maPhong) => {
  const deleted = await db.PhongBan.destroy({
    where: { ma_phong: normalizeCode(maPhong) },
  });
  if (!deleted) {
    return { error: "Phòng ban không tồn tại", status: 404 };
  }
  return { data: true };
};

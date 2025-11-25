import db from "../models/index.js";

// Chuẩn hóa mã chức vụ: trim và chuyển sang uppercase
const normalizeCode = (value) =>
  typeof value === "string" ? value.trim().toUpperCase() : "";

// Chuẩn hóa chuỗi để loại bỏ khoảng trắng dư
const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value;

//  mã chức vụ phải đúng 1 ký tự chữ/số
const isValidCode = (value) => /^[A-Za-z0-9]{1}$/.test(value || "");

export const listChucVus = async () =>
  db.ChucVu.findAll({
    order: [["ma_chucvu", "ASC"]],
    raw: true,
  });

export const findChucVuByMa = async (maChucVu) =>
  db.ChucVu.findOne({
    where: { ma_chucvu: normalizeCode(maChucVu) },
    raw: true,
  });

export const createChucVu = async (payload = {}) => {
  const maChucVu = normalizeCode(payload.ma_chucvu || "");
  const exists = await db.ChucVu.findOne({
    where: { ma_chucvu: maChucVu },
    raw: true,
  });
  if (exists) {
    return { error: "ma_chucvu đã tồn tại", status: 409 };
  }
  if (!isValidCode(maChucVu)) {
    return {
      error: "ma_chucvu phải gồm đúng 1 ký tự chữ hoặc số",
      status: 400,
    };
  }
  const tenChucVu = normalizeString(payload.ten_chucvu || "");
  if (!maChucVu || !tenChucVu) {
    return { error: "Thông tin chức vụ không hợp lệ", status: 400 };
  }
  const created = await db.ChucVu.create({
    ma_chucvu: maChucVu,
    ten_chucvu: tenChucVu,
  });
  return { data: created.get({ plain: true }) };
};

export const updateChucVu = async (maChucVu, updates) => {
  const record = await db.ChucVu.findByPk(normalizeCode(maChucVu));
  if (!record) {
    return { error: "Chức vụ không tồn tại", status: 404 };
  }
  const safeUpdates = { ...updates };
  delete safeUpdates.ma_chucvu;
  if (safeUpdates.ten_chucvu !== undefined) {
    const nextValue = normalizeString(safeUpdates.ten_chucvu || "");
    if (!nextValue) {
      return { error: "ten_chucvu không hợp lệ", status: 400 };
    }
    safeUpdates.ten_chucvu = nextValue;
  }
  await record.update(safeUpdates);
  const refreshed = await db.ChucVu.findByPk(record.ma_chucvu, {
    raw: true,
  });
  return { data: refreshed };
};

export const deleteChucVu = async (maChucVu) => {
  const deleted = await db.ChucVu.destroy({
    where: { ma_chucvu: normalizeCode(maChucVu) },
  });
  if (!deleted) {
    return { error: "Chức vụ không tồn tại", status: 404 };
  }
  return { data: true };
};

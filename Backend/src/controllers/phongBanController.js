import {
  listPhongBans,
  findPhongBanByMa,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
} from "../services/phongBanService.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await listPhongBans();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const record = await findPhongBanByMa(req.params.ma_phong);
    if (!record) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { data, error, status } = await createPhongBan(req.body);
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { data, error, status } = await updatePhongBan(
      req.params.ma_phong,
      req.body
    );
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { error, status } = await deletePhongBan(req.params.ma_phong);
    if (error) {
      return res.status(status || 400).json({ message: error });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
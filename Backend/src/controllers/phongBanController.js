import {
  listPhongBans,
  findPhongBanByMa,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
  getPhongBanDetails
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
    //api/phong-bans/P01?thang=11&nam=2025)
    const thang = req.query.thang ? parseInt(req.query.thang) : undefined;
    const nam = req.query.nam ? parseInt(req.query.nam) : undefined;
    const { data: record, error, status } = await getPhongBanDetails(
        req.params.ma_phong, 
        thang, 
        nam
    ); 

   if (error) {
     return res.status(status || 404).json({ message: error });
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
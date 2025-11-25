import { Router } from "express";
import * as chucVuController from "../controllers/chucVuController.js";

const router = Router();

router.get("/", chucVuController.getAll);
router.get("/:ma_chucvu", chucVuController.getById);
router.post("/", chucVuController.create);
router.put("/:ma_chucvu", chucVuController.update);
router.delete("/:ma_chucvu", chucVuController.remove);

export default router;

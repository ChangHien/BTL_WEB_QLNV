import { Router } from "express";
import phongBanRoute from "./phongBanRoute.js";
import chucVuRoute from "./chucVuRoute.js";

const router = Router();

router.use("/phong-bans", phongBanRoute);
router.use("/chuc-vus", chucVuRoute);

export default router;

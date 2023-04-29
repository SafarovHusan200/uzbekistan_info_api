const { Router } = require("express");
const {
  getAllRegion,
  getRegionById,
  createNewRegion,
  updateRegion,
  deleteRegion,
} = require("../controllers/region.control");
const router = Router();
const {
  protected,
  adminStatus,
  apiKeyAccess,
  payment,
} = require("../middlewares/auth");
const upload = require("../utils/fileUpload");

router.get("/", apiKeyAccess, getAllRegion);
router.get("/:id", apiKeyAccess, getRegionById);
router.post(
  "/",
  protected,
  adminStatus,
  upload.single("image"),
  createNewRegion
);
router.put("/:id", protected, adminStatus, updateRegion);
router.delete("/:id", protected, adminStatus, deleteRegion);

module.exports = router;

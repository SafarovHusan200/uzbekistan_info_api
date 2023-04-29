const { Router } = require("express");
const {
  getAllDistrict,
  getDistrictById,
  addNewDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../controllers/district.controller");
const router = Router();
const upload = require("../utils/fileUpload");
const { protected, adminStatus, apiKeyAccess } = require("../middlewares/auth");

router.get("/", apiKeyAccess, getAllDistrict);
router.get("/:id", apiKeyAccess, getDistrictById);
router.post(
  "/",
  protected,
  adminStatus,
  upload.single("image"),
  addNewDistrict
);
router.put("/:id", protected, adminStatus, updateDistrict);
router.delete("/:id", protected, adminStatus, deleteDistrict);

module.exports = router;

const { Router } = require("express");
const {
  register,
  login,
  updateProfile,
  getProfile,
  updatePassword,
  paymentBalans,
  activateProfile,
} = require("../controllers/auth.controller");

const { protected, apiKeyAccess, adminStatus } = require("../middlewares/auth");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protected, getProfile);
router.put("/update", protected, updateProfile);
router.put("/updatepassword", protected, updatePassword);
router.put("/paymentBalance", protected, paymentBalans);
router.put("/activate", protected, activateProfile);

module.exports = router;

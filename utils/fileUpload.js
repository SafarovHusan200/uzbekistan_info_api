const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Upload
const upload = multer({
  storage,
  limits: { fileSize: 4000000 },
  fileFilter: function (req, file, cb) {
    checkFileTypes(file, cb);
  },
});

// check file types
function checkFileTypes(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: You can only upload image files");
  }
}
module.exports = upload;

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

// Initialize env variables
dotenv.config();

// Connect database
connectDB();

// App instance
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Statis folder
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// This is routes
// auth => user register, login, getProfile, update(profile and password), delete, payment and activate status
app.use("/api/v1/auth", require("./routes/auth.route"));
// region(viloyat) => createNewRegion, allRegion, RegionById, update and delete region
app.use("/api/v1/regions", require("./routes/region.route"));
// district(tuman) => createNewDistrict, allDistrict, DistrictById, update and delete district
app.use("/api/v1/districts", require("./routes/district.route"));

// Error
app.use(require("./middlewares/error"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port: ${PORT}`.white.bold
  )
);

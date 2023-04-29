const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    area: {
      type: String,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
    districtCenter: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("District", districtSchema);

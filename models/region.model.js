const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
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
    districtsNumber: {
      type: Number,
      required: true,
    },
    regionCenter: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    districts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Region", regionSchema);

const District = require("../models/district.model");
const Region = require("../models/region.model");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @descr   Get all district
// @route   GET /api/v1/districts
// @Access  Public / with payment
exports.getAllDistrict = asyncHandler(async (req, res, next) => {
  const pageLimit = process.env.DEFAULT_PAGE_LIMIT;
  const limit = parseInt(req.body.limit || pageLimit);
  const page = parseInt(req.body.page || 1);
  const total = District.countDocuments();

  const districts = await District.find()
    .skip(limit * page - limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    pageCount: Math.ceil(total / limit),
    currentPage: page,
    nextPage: Math.ceil(total / limit < page + 1 ? null : page + 1),
    data: districts,
  });
});

// @descr   Get  districtById
// @route   GET /api/v1/districts/:id
// @Access  Public / with payment
exports.getDistrictById = asyncHandler(async (req, res, next) => {
  const district = await District.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: district,
  });
});

// @descr   add new district
// @route   POST /api/v1/districts
// @Access  Private / with adminStatus
exports.addNewDistrict = asyncHandler(async (req, res, next) => {
  const { name, area, population, districtCenter, region } = req.body;
  const regionOneData = await Region.findOne({ name: region });
  const newDistrict = await District.create({
    name,
    area,
    population,
    districtCenter,
    image: "uploads/" + req.file.filename,
    region: regionOneData._id,
  });

  await Region.findOneAndUpdate(
    { name: region },
    {
      $push: { districts: newDistrict._id },
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.status(201).json({
    success: true,
    data: newDistrict,
  });
});

// @descr   update district
// @route   PUT /api/v1/districts/:id
// @Access  Private / with adminStatus
exports.updateDistrict = asyncHandler(async (req, res, next) => {
  const district = await District.findById(req.params.id);

  const updatedDistrict = await District.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name || district.name,
      area: req.body.area || district.area,
      population: req.body.population || district.population,
      districtCenter: req.body.districtCenter || district.districtCenter,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedDistrict,
  });
});

// @descr   delete district
// @route   DELETE /api/v1/districts/:id
// @Access  Private / with adminStatus
exports.deleteDistrict = asyncHandler(async (req, res, next) => {
  const district = await District.findById(req.params.id);
  const region = await Region.findById(district.region);

  const district_in_region = Object.values(region.districts);
  const updateId = district_in_region.filter((id) => id != req.params.id);
  await Region.findByIdAndUpdate(
    district.region,
    {
      districts: updateId,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  await District.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "District successfully deleted!",
  });
});

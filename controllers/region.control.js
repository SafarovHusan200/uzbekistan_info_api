const asyncHandler = require("../middlewares/async");
const Region = require("../models/region.model");
const ErrorResponse = require("../utils/errorResponse");

// @descr   Get all region
// @route   GET /api/v1/region
// @Access  Private
exports.getAllRegion = asyncHandler(async (req, res, next) => {
  const pageLimit = process.env.DEFAULT_PAGE_LIMIT;
  const limit = parseInt(req.query.limit || pageLimit);
  const page = parseInt(req.query.page || 1);
  const total = await Region.countDocuments();

  const regions = await Region.find()
    .skip(page * limit - limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    pageCount: Math.ceil(total / limit),
    currentPage: page,
    nextPage: Math.ceil(total / limit < page + 1 ? null : page + 1),
    data: regions,
  });
});

// @descr   Get region ById
// @route   GET /api/v1/region/:id
// @Access  Private
exports.getRegionById = asyncHandler(async (req, res, next) => {
  const region = await Region.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: region,
  });
});

// @descr   Post all Region
// @route   POST /api/v1/region
// @Access  Private
exports.createNewRegion = asyncHandler(async (req, res, next) => {
  const { name, area, population, districtsNumber, regionCenter } = req.body;

  const newRegion = await Region.create({
    name,
    area,
    population,
    districtsNumber,
    regionCenter,
    image: "uploads/" + req.file.filename,
  });

  res.status(201).json({
    success: true,
    data: newRegion,
  });
});

// @descr   update region
// @route   PUT /api/v1/region/:id
// @Access  Private
exports.updateRegion = asyncHandler(async (req, res, next) => {
  const region = await Region.findById(req.params.id);
  const updatedRegion = await Region.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name || region.name,
      area: req.body.area || region.area,
      population: req.body.population || region.population,
      districtsNumber: req.body.population || region.districtsNumber,
      regionCenter: req.body.population || region.regionCenter,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedRegion,
  });
});

// @descr   delete region
// @route   DELETE /api/v1/region/:id
// @Access  Private
exports.deleteRegion = asyncHandler(async (req, res, next) => {
  await Region.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Region successfully deleted!",
  });
});

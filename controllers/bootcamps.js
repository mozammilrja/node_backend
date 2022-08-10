const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");

// @desc   get all bootcapms
// @route  GET  /api/v1/bootcamp
// @access  public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
 
  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ['select','sort','page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(req.query);

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  // Find resources
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // sort 
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join('');
    query = query.sort(sortBy)
  } else {
    query = query.sort('_createdAt')
  }

  // pagination
  const page = parseInt (req.query.page, 10) || 1;
  const limit = parseInt(req.query.page, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcapms = await query 

  //Pagination result

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  
  res
    .status(200)
    .json({ success: true, count: bootcapms.length,pagination, data: bootcapms });
});
// @desc   get single bootcapms
// @route  GET  /api/v1/bootcamp/:id
// @access  public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));}
      res.status(200).json({ success: true, data: bootcamp });
});
// @desc   Create new bootcapms
// @route   POST  /api/v1/bootcamp/
// @access  private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});
// @desc   Update bootcapms
// @route   PUT  /api/v1/bootcamp/:id
// @access  private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// @desc   Delete bootcapms
// @route   DELETE  /api/v1/bootcamp/:id
// @access  private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove()
  res.status(200).json({ success: true, data: {} });
});

// @desc   Get bootcapms within a radius
// @route   Get  /api/v1/bootcamp/radius/:zipcode/:distance
// @access  private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Devide br radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcapms = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcapms.length,
    data: bootcapms,
  });
});



// @desc   upload photo for  bootcapms
// @route   put  /api/v1/bootcamps/:id/photo
// @access  private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`please upload a file`, 404));
  }
  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startWidth('image')) {
        return next(new ErrorResponse(`please upload a image file`, 404));
  }
});
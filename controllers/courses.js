const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");


// @desc   get  cources
// @route  GET  /api/v1/cources
// @route  GET  /api/v1/bootcamps/:bootcampsId/cources
// @access  public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId})
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

// @desc   get single cources
// @route  GET  /api/v1/cources':id
// @access  public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name,description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),400
        )}

    res.status(200).json({
        success: true,
        data: course
    })
})
// @desc   Add cources
// @route  GET  /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`),400
        )}

    const course = await Course.create(req.body)
    
    res.status(200).json({
        success: true,
        data: course
    })
})
// @desc  Update cources
// @route  PUT  /api/v1/courses/:id
// @access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
   let  course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        400
      );
    }
    couse = await Course.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({
        success: true,
        data: course
    })
})
// @desc  Delete cources
// @route  DELETE  /api/v1/courses/:id
// @access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
   const  course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        400
      );
    }
    await course.remove()
    res.status(200).json({
        success: true,
        data: {}
    })
})
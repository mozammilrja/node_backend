const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require("../utils/errorResponse")

// @desc   get all bootcapms
// @route  GET  /api/v1/bootcamp
// @access  public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcapms = await Bootcamp.find();
   res.status(400).json({ success: true, count: bootcapms.length, data:bootcapms });
  } catch (error) {
    res.status(400).json({ success: false })
  }
}
// @desc   get single bootcapms
// @route  GET  /api/v1/bootcamp/:id
// @access  public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
       res.status(400).json({ success: true, data: bootcamp });

  } catch (err) {
      // res.status(400).json({ success: false });
    next( new ErrorResponse( `Bootcamp not found with id of ${req.params.id}`,404) )
  }

}
// @desc   Create new bootcapms
// @route   POST  /api/v1/bootcamp/
// @access  private 

exports.createBootcamp = async (req, res, next) => { 

  try {
      const bootcamp = await Bootcamp.create(req.body);
      res.status(201).json({
        success: true,
        data: bootcamp,
      });
    
  } catch (error) {
    res.status(400).json({success: false})
  }



}
// @desc   Update bootcapms
// @route   PUT  /api/v1/bootcamp/:id
// @access  private

exports.updateBootcamp = async (req, res, next) => {
  try {
     const bootcamp = await Bootcamp.findByIdAndUpdate(
       req.params.id,
       req.body,
       {
         new: true,
         runValidators: true,
       }
     );
     if (!bootcamp) {
       return res.status(400).json({ success: false });
     }
     res.status(400).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
 
}
// @desc   Delete bootcapms
// @route   DELETE  /api/v1/bootcamp/:id
// @access  private

exports.deleteBootcamp = async (req, res, next) => {
  try {
     const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
     if (!bootcamp) {
       return res.status(400).json({ success: false });
     }
     res.status(400).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
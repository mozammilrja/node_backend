const express = require('express') 
const { 
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')


const coursesRouter = require('./courses')

const router = express.Router()
const {protect} = require  ('../middleware/auth')
 
// Re-route into other resources routers

router.use('/:bootcampId/courses',coursesRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);


router.route("/").get(getBootcamps).post(protect,createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);


module.exports = router
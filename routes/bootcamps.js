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
 
// Re-route into other resources routers

router.use('/:bootcampId/courses',coursesRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);


router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)


module.exports = router
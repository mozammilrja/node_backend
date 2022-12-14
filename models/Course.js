const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Claculating avg cost...'.blue);

  const obj = await this.aggregate([
    {
      $match: {bootcamp:bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        getAverageCost: { $avg: '$tuition'}
      }
    }
  ])
  console.log(obj)
}

// call getAverageCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
  
})

// call getAverageCost before remove
CourseSchema.pre('remove ', function () {
    this.constructor.getAverageCost(this.bootcamp);
  
})

module.exports = mongoose.model("Course", CourseSchema);
 
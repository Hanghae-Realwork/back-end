const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  // resumeId: {
  //   type: ObjectId,
  // },
  userId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  content2: {
    type: String,
    required: true,
  },
  content3: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
    default: [],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
});
ResumeSchema.virtual("resumeId").get(function () {
  return this._id.toHexString();
});
ResumeSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Resume", ResumeSchema);

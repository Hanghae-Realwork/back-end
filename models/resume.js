const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  // resumeId: {
  //   type: ObjectId,
  // },
  // userId: {
  //   type: String,
  // },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  content2: {
    type: String,
  },
  content3: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  skills: {
    type: Array,
    required: true,
    default: [],
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
});
ResumeSchema.virtual("resumeId").get(function () {
  return this._id.toHexString();
});
ResumeSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Resume", ResumeSchema);

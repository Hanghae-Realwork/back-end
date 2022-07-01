const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    // resumeId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    userId: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    skills: {
      type: Array,
      required: true,
      default: [],
    },
    content2: {
      type: String,
      required: true,
    },
    content3: {
      type: String,
      required: true,
    },
    resumeImage: {
      type: String,
    },
  },
  { timestamps: true }
);
ResumeSchema.virtual("resumeId").get(function () {
  return this._id.toHexString();
});
ResumeSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Resume", ResumeSchema);

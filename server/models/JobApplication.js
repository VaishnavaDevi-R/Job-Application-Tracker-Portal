const mongoose = require("mongoose");

const jobApplicationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    companyName: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "OA",
        "Interview",
        "Offer",
        "Rejected",
      ],
      default: "Applied",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);
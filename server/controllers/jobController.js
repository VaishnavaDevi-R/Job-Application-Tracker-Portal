const JobApplication = require("../models/JobApplication");

// GET ALL JOBS
const getJobs = async (req, res) => {
  const jobs = await JobApplication.find({
    user: req.user,
  });

  res.json(jobs);
};

// CREATE JOB
const createJob = async (req, res) => {
  const job = await JobApplication.create({
    ...req.body,
    user: req.user,
  });

  res.status(201).json(job);
};

// UPDATE JOB
const updateJob = async (req, res) => {
  const job = await JobApplication.findById(
    req.params.id
  );

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  const updatedJob =
    await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(updatedJob);
};

// DELETE JOB
const deleteJob = async (req, res) => {
  const job = await JobApplication.findById(
    req.params.id
  );

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  await JobApplication.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Job deleted successfully",
  });
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
};
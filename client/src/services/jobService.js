import axios from "axios";

const API_URL = "https://job-application-tracker-api-ht6n.onrender.com/api/jobs";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getJobs = async () => {
  const response = await axios.get(API_URL, config());
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axios.post(
    API_URL,
    jobData,
    config()
  );
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    config()
  );
  return response.data;
};

export const updateJob = async (
  id,
  jobData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    jobData,
    config()
  );

  return response.data;
};
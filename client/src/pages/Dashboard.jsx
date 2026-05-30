import "../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
} from "../services/jobService";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      companyName: "",
      jobTitle: "",
      location: "",
    });

  const [formData, setFormData] =
    useState({
      companyName: "",
      jobTitle: "",
      location: "",
      status: "Applied",
    });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const data = await getJobs();

      setJobs(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await createJob(formData);

      alert("Application Added");

      setFormData({
        companyName: "",
        jobTitle: "",
        location: "",
        status: "Applied",
      });

      loadJobs();
    } catch (error) {
      alert("Error Adding Application");
    }
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      alert("Application Deleted");

      loadJobs();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const handleStatusChange =
    async (id, status) => {
      try {
        await updateJob(id, {
          status,
        });

        loadJobs();
      } catch (error) {
        alert(
          "Status Update Failed"
        );
      }
    };

  const startEdit = (job) => {
    setEditingId(job._id);

    setEditData({
      companyName:
        job.companyName,
      jobTitle: job.jobTitle,
      location: job.location,
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateJob(id, editData);

      setEditingId(null);

      loadJobs();

      alert(
        "Updated Successfully"
      );
    } catch (error) {
      alert("Update Failed");
    }
  };

  const filteredJobs = jobs.filter(
    (job) => {
      const matchesStatus =
        filterStatus === "All" ||
        job.status === filterStatus;

      const matchesSearch =
        job.companyName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesStatus &&
        matchesSearch
      );
    }
  );

  const totalApplications =
    jobs.length;

  const appliedCount = jobs.filter(
    (job) =>
      job.status === "Applied"
  ).length;

  const oaCount = jobs.filter(
    (job) => job.status === "OA"
  ).length;

  const interviewCount =
    jobs.filter(
      (job) =>
        job.status === "Interview"
    ).length;

  const offerCount = jobs.filter(
    (job) =>
      job.status === "Offer"
  ).length;

  const rejectedCount =
    jobs.filter(
      (job) =>
        job.status === "Rejected"
    ).length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Loading Applications...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>
            Job Application Tracker
          </h1>

          <h2>
            Welcome {user?.name}
          </h2>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <h2>
            {totalApplications}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>
          <h2>{appliedCount}</h2>
        </div>

        <div className="stat-card">
          <h3>OA</h3>
          <h2>{oaCount}</h2>
        </div>

        <div className="stat-card">
          <h3>Interview</h3>
          <h2>
            {interviewCount}
          </h2>
        </div>

        <div className="stat-card">
          <h3>Offer</h3>
          <h2>{offerCount}</h2>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <h2>
            {rejectedCount}
          </h2>
        </div>
      </div>

      <div className="job-form">
        <h2>
          Add Job Application
        </h2>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={
              formData.companyName
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={
              formData.jobTitle
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={
              formData.location
            }
            onChange={
              handleChange
            }
          />

          <select
            name="status"
            value={
              formData.status
            }
            onChange={
              handleChange
            }
          >
            <option value="Applied">
              Applied
            </option>
            <option value="OA">
              OA
            </option>
            <option value="Interview">
              Interview
            </option>
            <option value="Offer">
              Offer
            </option>
            <option value="Rejected">
              Rejected
            </option>
          </select>

          <button
            className="add-btn"
            type="submit"
          >
            Add Application
          </button>
        </form>
      </div>

      <h2>Your Applications</h2>

      <input
        className="search-bar"
        type="text"
        placeholder="Search Company..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      <select
        className="filter-dropdown"
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(
            e.target.value
          )
        }
      >
        <option value="All">
          All
        </option>
        <option value="Applied">
          Applied
        </option>
        <option value="OA">
          OA
        </option>
        <option value="Interview">
          Interview
        </option>
        <option value="Offer">
          Offer
        </option>
        <option value="Rejected">
          Rejected
        </option>
      </select>

      <br />
      <br />

      {filteredJobs.length ===
      0 ? (
        <div className="job-card">
          <h3>
            No Applications Yet
          </h3>

          <p>
            Start tracking your
            job applications by
            adding one above.
          </p>
        </div>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job._id}
            className="job-card"
          >
            {editingId ===
            job._id ? (
              <>
                <input
                  value={
                    editData.companyName
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      companyName:
                        e.target
                          .value,
                    })
                  }
                />

                <input
                  value={
                    editData.jobTitle
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      jobTitle:
                        e.target
                          .value,
                    })
                  }
                />

                <input
                  value={
                    editData.location
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      location:
                        e.target
                          .value,
                    })
                  }
                />

                <button
                  className="add-btn"
                  onClick={() =>
                    saveEdit(
                      job._id
                    )
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h3>
                  {
                    job.companyName
                  }
                </h3>

                <p>
                  <strong>
                    Role:
                  </strong>{" "}
                  {
                    job.jobTitle
                  }
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {
                    job.location
                  }
                </p>

                <select
                  className="status-select"
                  value={
                    job.status
                  }
                  onChange={(
                    e
                  ) =>
                    handleStatusChange(
                      job._id,
                      e.target
                        .value
                    )
                  }
                >
                  <option value="Applied">
                    Applied
                  </option>
                  <option value="OA">
                    OA
                  </option>
                  <option value="Interview">
                    Interview
                  </option>
                  <option value="Offer">
                    Offer
                  </option>
                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

                <br />
                <br />

                <button
                  className="edit-btn"
                  onClick={() =>
                    startEdit(job)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      job._id
                    )
                  }
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
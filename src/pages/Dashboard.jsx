import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [editId, setEditId] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(true);

  const [saving, setSaving] = useState(false);
const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH DATA =================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchProfileAndStats = async () => {
      try {
        const { data: userData } = await API.get("/auth/profile");
        setProfile(userData);

        const { data: statsData } = await API.get("/problems/stats");
        setStats(statsData);
      } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchProblems = async () => {
      try {
        const { data: problemData } = await API.get("/problems");
        setProblems(problemData.problems);
      } catch (error) {
        toast.error("Failed to load problems");
      } finally {
        setLoadingProblems(false);
      }
    };

    fetchProfileAndStats();
    fetchProblems();
  }, []);

  // ================= ADD / UPDATE =================

const handleSubmit = async (e) => {
  e.preventDefault();

  if (saving) return;

  try {
    setSaving(true);

    if (editId) {
      const { data } = await API.put(`/problems/${editId}`, {
        title,
        platform,
        difficulty,
        topic,
      });

      setProblems((prev) =>
        prev.map((p) => (p._id === editId ? data : p))
      );

      toast.success("Problem updated successfully");
      setEditId(null);
    } else {
      const { data } = await API.post("/problems", {
        title,
        platform,
        difficulty,
        topic,
      });

      setProblems((prev) => [data, ...prev]);

      setStats((prev) => ({
        total: prev.total + 1,
        easy: difficulty === "Easy" ? prev.easy + 1 : prev.easy,
        medium: difficulty === "Medium" ? prev.medium + 1 : prev.medium,
        hard: difficulty === "Hard" ? prev.hard + 1 : prev.hard,
      }));

      toast.success("Problem added successfully");
    }

    setTitle("");
    setPlatform("");
    setDifficulty("Easy");
    setTopic("");

  } catch (error) {
    toast.error("Operation failed");
  } finally {
    setSaving(false);
  }
};
  // ================= DELETE =================

const handleDelete = async (id) => {
  try {
    setDeletingId(id);

    await API.delete(`/problems/${id}`);

    setProblems((prev) => prev.filter((p) => p._id !== id));

    toast.success("Problem deleted successfully");
  } catch (error) {
    toast.error("Delete failed");
  } finally {
    setDeletingId(null);
  }
};

  // ================= UI =================

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* PROFILE + STREAK */}
      {loadingProfile ? (
        <div className="card skeleton" />
      ) : (
        profile && (
          <div className="card">
            <h3>Welcome, {profile.name}</h3>
            <p>Current Streak: {profile.currentStreak}</p>
            <p>Longest Streak: {profile.longestStreak}</p>
          </div>
        )
      )}

      {/* ADD / UPDATE FORM */}
      <div className="card">
        <h2>{editId ? "Update Problem" : "Add Problem"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              placeholder="Platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <input
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

<button type="submit" disabled={saving}>
  {saving ? "Saving..." : editId ? "Update" : "Add"}
</button>
        </form>
      </div>

      {/* STATS */}
      {loadingProfile ? (
        <div className="card skeleton" />
      ) : (
        stats && (
          <div className="card">
            <h2>Statistics</h2>
            <p>Total: {stats.total}</p>
            <p>Easy: {stats.easy}</p>
            <p>Medium: {stats.medium}</p>
            <p>Hard: {stats.hard}</p>
          </div>
        )
      )}

      {/* PROBLEM LIST */}
      <div className="card">
        <h2>Your Problems</h2>

        {loadingProblems ? (
          <>
            <div className="skeleton list-skeleton" />
            <div className="skeleton list-skeleton" />
            <div className="skeleton list-skeleton" />
          </>
        ) : (
          <ul className="problem-list">
            {problems.map((problem) => (
              <li key={problem._id} className="problem-item">
                <span>
                  {problem.title} - {problem.difficulty}
                </span>

                <div className="problem-actions">
                  <button
                    onClick={() => {
                      setEditId(problem._id);
                      setTitle(problem.title);
                      setPlatform(problem.platform);
                      setDifficulty(problem.difficulty);
                      setTopic(problem.topic);
                    }}
                  >
                    Edit
                  </button>

<button
  onClick={() => handleDelete(problem._id)}
  disabled={deletingId === problem._id}
>
  {deletingId === problem._id ? "Deleting..." : "Delete"}
</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
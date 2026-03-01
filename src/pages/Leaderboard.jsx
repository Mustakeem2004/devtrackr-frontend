import { useEffect, useState } from "react";
import API from "../services/api";
import "./Leaderboard.css";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/leaderboard");
        setLeaders(data);
      } catch (error) {
        console.log("Error fetching leaderboard");
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1 className="leaderboard-title">Leaderboard 🏆</h1>

        <ul className="leaderboard-list">
          {leaders.map((user, index) => (
            <li key={index} className="leaderboard-item">
              <span>
                #{index + 1} {user.name}
              </span>
              <span>{user.totalProblems} problems</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
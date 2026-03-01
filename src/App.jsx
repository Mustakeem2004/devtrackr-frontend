import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <>

      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      {/* Toast must be OUTSIDE Routes */}
      <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
        newestOnTop
       closeOnClick
      pauseOnHover
      theme="colored"
      />
            
    </>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Router>
        <div className="container"></div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

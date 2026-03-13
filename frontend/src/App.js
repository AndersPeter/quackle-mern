import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import About from "./pages/About";

function App() {
  return (
    <>
      <Router>
        <div className="app-shell">
          <Header />
          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/admin" element={<PrivateRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Locations from "./pages/Locations";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import VirtualMailbox from "./components/VirtualMailbox";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:token" element={<Activate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mailbox" element={<VirtualMailbox />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthForm from "./Pages/AuthForm";
import MainPage from "./Pages/MainPage";
import ProfilePage from "./Pages/ProfilePage";
import CreatePage from "./Pages/CreatePage";
import Team from "./Pages/Team";
import Pipeline from "./Pages/Pipeline";
import Navbar from "./components/Navbar";
import Settings from "./Pages/Settings";
import About from "./Pages/About";
function App() {

  // ✅ All state variables defined here
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");   // <-- REQUIRED

  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE (no navbar) */}
        <Route path="/" element={<AuthForm />} />

        {/* ✅ Navbar wraps all /main routes */}
        <Route
  element={
    <Navbar
      isSidebarExpanded={isSidebarExpanded}
      setIsSidebarExpanded={setIsSidebarExpanded}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      setIsAddModalOpen={setIsAddModalOpen}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  }
>

  <Route
    path="/main"
    element={
      <MainPage
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
    }
  />

+ <Route path="/main/pipeline" element={<Pipeline />} />   {/* ✅ add this */}
  <Route path="/main/profile" element={<ProfilePage />} />
  <Route path="/main/create" element={<CreatePage />} />
  <Route path="/main/team" element={<Team />} />
  <Route path="/main/settings" element={<Settings />} />
  <Route path="/main/about" element={<About />} />


</Route>

      </Routes>
    </Router>
  );
}

export default App;

import "./App.css";
import Notes from "./components/notes";
import Cours from "./components/cours";
import Layout from "./components/Layout";
import Login from "./components/Login";

import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import MyCourses from "./components/cours/MyCourses";
import Profile from "./components/profile";
import Filieres from "./components/Filieres";
import Stagiaires from "./components/Stagiaires";
import Formateur from "./components/Formateur";
import Modules from "./components/modules";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const api = window.env.API_URI;

  const [firstLoad, setFirstLoad] = useState(true);
  const [user, setUser] = useState();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const req = await fetch(`${api}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await req.json();
    setUser(res.payload);
  };

  useEffect(() => {
    if (firstLoad) {
      fetchUser();
    }
  }, []);

  return (
    <div className="h-screen static">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Layout />}>
            {user?.role !== "surveillant" && (
              <Route path="/" element={<Profile />} />
            )}
            {user?.role === "surveillant" && (
              <Route path="/" element={<Stagiaires />} />
            )}
            <Route path="/profile" element={<Profile />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/cours" element={<Cours />} />
            <Route path="/mescours" element={<MyCourses />} />
            <Route path="/filieres" element={<Filieres />} />
            <Route path="/stagiaires" element={<Stagiaires />} />
            <Route path="/formateurs" element={<Formateur />} />
            <Route path="/modules" element={<Modules />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

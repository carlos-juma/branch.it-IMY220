import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SplashPage from "./pages/SplashPage";
import Header from "./components/header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import ProjectsPage from "./pages/ProjectsPage";
import Layout from "./components/Layout";
import ProjectPage from "./pages/ProjectPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

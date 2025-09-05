import React from "react";
import Profile from "../components/profile/Profile";
import EditProfileForm from "../components/profile/EditProfileForm";
import ProjectList from "../components/profile/ProjectList";
import FriendsList from "../components/profile/FriendsList";
import CreateProjectForm from "../components/profile/CreateProjectForm";

const ProfilePage = () => {
  // Dummy user data
  const user = {
    id: 1,
    name: "Ms Person",
    bio: "Full-stack developer passionate about open-source.",
    email: "personlady@example.com",
    location: "Pretoria, South Africa",
    avatar: "/assets/images/avatar1.png"
  };

  const projects = [
    { id: 1, name: "Version Control App", description: "A simple Git clone." },
    { id: 2, name: "Weather Dashboard", description: "React app for weather data." }
  ];

  const friends = [
    { id: 2, name: "John McGinn", avatar: "/assets/images/avatar2.png" },
    { id: 3, name: "Alex Hunter", avatar: "/assets/images/avatar3.png" }
  ];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Profile user={user} />
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <EditProfileForm user={user} />
        <CreateProjectForm />
      </section>
      <section className="mt-6">
        <ProjectList projects={projects} />
      </section>
      <section className="mt-6">
        <FriendsList friends={friends} />
      </section>
    </main>
  );
};

export default ProfilePage;

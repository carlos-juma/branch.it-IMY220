import React from "react";
import Feed from "../components/home/Feed";
import SearchInput from "../components/home/SearchInput";
import FriendsList from "../components/profile/FriendsList";

const HomePage = () => {
  const projects = [
    {
      id: 1,
      name: "Novel",
      description: "A very romantic book about version control systems.",
      type: "Literature",
    },
    {
      id: 2,
      name: "Git clone: The album",
      description: "Its git music?",
      type: "music",
    },
    {
      id: 3,
      name: "Chat App",
      description: "Real-time messaging app.",
      type: "Mobile App",
    },
  ];

    const friends = [
    { id: 2, name: "John McGinn", avatar: "/assets/images/avatar2.png" },
    { id: 3, name: "Alex Hunter", avatar: "/assets/images/avatar3.png" }
  ];

  return (
    <main className="p-6 w-[80vw] mx-auto flex flex-row justify-between gap-6">
      <div className="w-[45vw]">
        <h1 className="text-2xl font-bold mb-4">Home Feed</h1>
        <SearchInput />
        <Feed projects={projects} />
      </div>
      <div className="w-80">
        <FriendsList friends={friends} />
      </div>
    </main>
  );
};

export default HomePage;

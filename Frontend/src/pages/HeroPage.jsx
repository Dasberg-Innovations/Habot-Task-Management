import React from "react";

// Import components
import HeroCharacter from "../components/HeroCharacter";
import GoalProgress from "../components/GoalProgress";
import TaskList from "../components/TaskList";

export default function HeroPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4f] text-white font-sans p-10 gap-10 md:flex-row md:p-5">
      {/* Left side - Character */}
      <div className="flex-1 flex items-center justify-center">
        <div className="border-4 border-white rounded-2xl max-h-[70%] max-w-full">
          <HeroCharacter className="object-cover" />
        </div>
      </div>

      {/* Right side - Goals + Tasks */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="goals-section">
          <h2 className="mb-2">Goals</h2>
          {/* Replace goals with your goal components */}
          <GoalProgress />
        </div>
        <div className="tasks-section bg-opacity-15 backdrop-blur-md p-5 rounded-xl">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div 
      className="flex h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
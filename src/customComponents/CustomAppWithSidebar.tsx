import React from "react";

const CustomAppWithSidebar = ({
  sidebarContent,
  mainContent,
}: {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
}) => {
  return (
    <>
      <nav className="fixed z-10 top-0 left-0 w-64 h-screen bg-slate-800 shadow-2xl">
        <div className="w-full h-full p-4 overflow-hidden">
          {sidebarContent}
        </div>
      </nav>
      <section className="absolute top-0 left-64 right-0 h-full bg-slate-100">
        {mainContent}
      </section>
    </>
  );
};

export default CustomAppWithSidebar;

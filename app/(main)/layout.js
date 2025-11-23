import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="min-h-screen pt-16 pb-20">
      {children}
    </div>
  );
};

export default MainLayout;

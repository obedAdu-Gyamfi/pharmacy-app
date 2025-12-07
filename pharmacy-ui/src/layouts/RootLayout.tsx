import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-950 font-sans">
      {children}
    </div>
  );
};

export default Layout;

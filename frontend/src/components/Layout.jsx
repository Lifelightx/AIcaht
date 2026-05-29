import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-app-bg text-app-text transition-colors duration-200">
      {children}
    </div>
  );
};

export default Layout;

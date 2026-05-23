import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gh-bg text-gh-text transition-colors duration-200">
      {children}
    </div>
  );
};

export default Layout;

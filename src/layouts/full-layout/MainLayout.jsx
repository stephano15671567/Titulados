import React from 'react';
import Header from './Header';

const MainLayout = ({ children, showHeader }) => {
  return (
    <div>
      {showHeader && <Header />}
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

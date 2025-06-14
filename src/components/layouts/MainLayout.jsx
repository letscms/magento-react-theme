import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function MainLayout({ children }) {
  const { user } = useAuth();
  return (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 p-4 min-h-[calc(200vh-100vh)]">
      {children ? children : <Outlet context={{ user }} />}
     
    </main>
    <Footer />
  </div>
);

}

export default MainLayout;

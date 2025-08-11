import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { dummyUserData } from '../assets/assets';
import Loading from '../Components/Loading';
import { useSelector } from 'react-redux';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state)=> state.user.value);

  return user ? (
    <div className="flex w-full h-screen relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 overflow-auto">
        <Outlet />
      </div>

      {/* Toggle Icons */}
      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { FiGrid, FiUsers, FiDollarSign, FiClock, FiSettings, FiMenu, FiX, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { auth } from '../../firebase/firebase.init';
import { signOut } from 'firebase/auth';

const InvestmentAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const adminTabs = [
    { name: 'Dashboard Overview', path: '/admin/investments', icon: <FiGrid /> },
    { name: 'Manage Offers & Time Limits', path: '/admin/investments/offers', icon: <FiClock /> },
    { name: 'Investor Approvals & Compliance', path: '/admin/investments/investors', icon: <FiUsers /> },
    { name: 'Ledger & Capital Payouts', path: '/admin/investments/ledger', icon: <FiDollarSign /> },
    { name: 'Platform Settings', path: '/admin/investments/settings', icon: <FiSettings /> },
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B132B] text-[#0B132B] dark:text-white flex transition-colors duration-200">
        
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
        )}

        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B132B] dark:bg-[#0B132B] border-r border-gray-800 flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-800">
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">SINEX ADMIN</h1>
              <p className="text-xs text-[#00F2FE]">Investment Control Center</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
            {adminTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-[#0077B6] text-white shadow-md' : 'text-gray-300 hover:bg-[#1C2541] hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <FiLogOut className="text-lg" /> Sign Out Admin
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col md:pl-72">
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#1C2541]/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <FiMenu size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-[#0B132B] dark:text-white">Investment Administration</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Authorized Super Admin Control Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400">
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
};

export default InvestmentAdminLayout;
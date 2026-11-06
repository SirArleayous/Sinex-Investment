import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const InvestmentAdminOverview = () => {
  const [stats, setStats] = useState({ totalInvestors: 0, totalCapitalAllocated: 0, activeOffersCount: 0, pendingWithdrawals: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/investments/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
        else setError('Failed to load admin performance statistics.');
      })
      .catch(() => setError('Network connection error.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Syncing database metrics...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
          Admin Control Center
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Platform Overview & Metrics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Real-time aggregate data across all participating regional investors.</p>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-sm flex items-center gap-2"><FiAlertCircle /> {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Verified Investors</span>
            <FiUsers className="text-xl text-[#0077B6] dark:text-[#00F2FE]" />
          </div>
          <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white">{stats.totalInvestors}</h3>
        </div>

        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Total Capital Allocated</span>
            <FiDollarSign className="text-xl text-[#2A9D8F] dark:text-[#2EC4B6]" />
          </div>
          <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white">₦{stats.totalCapitalAllocated?.toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Active Offers</span>
            <FiClock className="text-xl text-amber-500" />
          </div>
          <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white">{stats.activeOffersCount}</h3>
        </div>

        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Pending Payouts</span>
            <FiTrendingUp className="text-xl text-[#0077B6] dark:text-[#00F2FE]" />
          </div>
          <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white">₦{stats.pendingWithdrawals?.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
};

export default InvestmentAdminOverview;
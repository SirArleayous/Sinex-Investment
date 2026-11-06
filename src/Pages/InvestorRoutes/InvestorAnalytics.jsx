import React, { useState, useEffect } from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const InvestorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/investments/analytics')
      .then(res => res.json())
      .then(data => { if (data.success) setAnalytics(data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
          Performance Intelligence
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Portfolio Analytics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Verified compounding yield metrics and capital efficiency tracking.</p>
      </div>

      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#0B132B] dark:text-white mb-4">Verified Yield Performance</h3>
        <p className="text-sm text-gray-500">Total Cumulative Return: <strong className="text-emerald-600">{analytics?.totalYield || '0%'}</strong></p>
      </div>
    </div>
  );
};

export default InvestorAnalytics;
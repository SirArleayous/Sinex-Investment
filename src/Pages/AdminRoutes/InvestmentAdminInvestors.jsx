import React, { useState, useEffect } from 'react';

const InvestmentAdminInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/investments/admin/investors')
      .then(res => res.json())
      .then(data => { if (data.success) setInvestors(data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Investor Approvals & Compliance</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Audit 12-point statutory compliance records (NIN, BVN, Tax ID).</p>
      </div>
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : investors.length === 0 ? <p className="text-sm text-gray-500 py-6 text-center">No pending institutional investors found.</p> : null}
      </div>
    </div>
  );
};

export default InvestmentAdminInvestors;
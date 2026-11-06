import React, { useState, useEffect } from 'react';

const InvestorBanking = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetch('/api/investments/profile')
      .then(res => res.json())
      .then(data => { if (data.success) setProfile(data.data); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Banking & Payment Methods</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Designated institutional payout channels.</p>
      </div>
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <p className="text-sm font-semibold text-[#0B132B] dark:text-white">Primary Bank / MoMo: {profile?.bankDetails?.bankName || 'Not Set'}</p>
        <p className="text-sm text-gray-500">Account Number: {profile?.bankDetails?.accountNumber || 'Not Set'}</p>
      </div>
    </div>
  );
};

export default InvestorBanking;
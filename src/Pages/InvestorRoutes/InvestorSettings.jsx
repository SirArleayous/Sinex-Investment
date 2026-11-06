import React, { useState, useEffect } from 'react';

export const InvestorProfile = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetch('/api/investments/profile')
      .then(res => res.json())
      .then(data => { if (data.success) setProfile(data.data); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Investor Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">12-Point Compliance Records</p>
      </div>
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2 text-sm">
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Country:</strong> {profile?.country}</p>
        <p><strong>NIN:</strong> {profile?.nin}</p>
      </div>
    </div>
  );
};

export const InvestorSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Security Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Manage credentials and 2FA.</p>
      </div>
    </div>
  );
};
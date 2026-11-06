import React from 'react';

const InvestmentAdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Platform Settings</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Configure global platform thresholds and security policies.</p>
      </div>
    </div>
  );
};

export default InvestmentAdminSettings;
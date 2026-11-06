import React, { useState, useEffect } from 'react';

const InvestorDividends = () => {
  const [dividends, setDividends] = useState([]);
  useEffect(() => {
    fetch('/api/investments/dividends')
      .then(res => res.json())
      .then(data => { if (data.success) setDividends(data.data); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Dividend & Return History</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Audited log of approved profit distributions.</p>
      </div>
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {dividends.length === 0 ? <p className="text-sm text-gray-500 py-6 text-center">No dividend history recorded.</p> : null}
      </div>
    </div>
  );
};

export default InvestorDividends;
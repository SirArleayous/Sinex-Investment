import React, { useState, useEffect } from 'react';

const InvestmentAdminLedger = () => {
  const [ledgers, setLedgers] = useState([]);
  useEffect(() => {
    fetch('/api/investments/admin/ledgers')
      .then(res => res.json())
      .then(data => { if (data.success) setLedgers(data.data); });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Ledger & Capital Payouts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Process withdrawal requests and review regional currency accounts.</p>
      </div>
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {ledgers.length === 0 ? <p className="text-sm text-gray-500 py-6 text-center">No payout records requiring review.</p> : null}
      </div>
    </div>
  );
};

export default InvestmentAdminLedger;
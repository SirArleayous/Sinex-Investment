import React, { useState } from 'react';

const InvestorWithdrawals = () => {
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/investments/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) })
    });
    const data = await res.json();
    setMsg(data.message || 'Withdrawal requested successfully.');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Withdrawal Requests</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Request payout from your available withdrawal balance.</p>
      </div>
      {msg && <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-medium">{msg}</div>}
      <form onSubmit={handleWithdraw} className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm max-w-xl space-y-4">
        <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="Withdrawal amount" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" />
        <button type="submit" className="w-full py-3 bg-[#0077B6] text-white font-semibold rounded-xl text-sm shadow">Request Payout</button>
      </form>
    </div>
  );
};

export default InvestorWithdrawals;
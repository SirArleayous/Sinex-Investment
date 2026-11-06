import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const InvestorDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('₦');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const [profileRes, depRes] = await Promise.all([
          fetch('/api/investments/profile'),
          fetch('/api/investments/deposits')
        ]);
        const profileData = await profileRes.json();
        const depData = await depRes.json();

        if (profileData.success && profileData.data?.currency) {
          const curr = profileData.data.currency;
          if (curr.includes('UGX')) setCurrencySymbol('USh ');
          else if (curr.includes('GHS')) setCurrencySymbol('₵ ');
          else if (curr.includes('ZAR')) setCurrencySymbol('R ');
          else setCurrencySymbol('₦ ');
        }
        if (depData.success) setDeposits(depData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch('/api/investments/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg('Deposit request logged successfully. Awaiting verification.');
        setAmount('');
      } else {
        setMsg(data.message || 'Deposit submission failed.');
      }
    } catch (err) {
      setMsg('Network error submitting deposit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
          Capital Funding
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Uninvested Deposit Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Fund your account to maintain uninvested capital ready for pool allocation.</p>
      </div>

      {msg && <div className="p-4 bg-blue-100 text-blue-800 rounded-xl text-sm font-medium">{msg}</div>}

      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm max-w-xl">
        <h3 className="text-lg font-bold text-[#0B132B] dark:text-white mb-4">Submit New Deposit Intent</h3>
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Amount ({currencySymbol})</label>
            <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]" placeholder="Enter deposit amount" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold rounded-xl text-sm shadow transition disabled:opacity-50">
            {submitting ? 'Processing...' : 'Submit Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvestorDeposits;
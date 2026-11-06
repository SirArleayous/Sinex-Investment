import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiTrendingUp, FiLock, FiDollarShield, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const InvestorHome = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('₦'); // Default fallback
  const [ledger, setLedger] = useState({
    actualBalance: 0,
    dailyEarned: 0,
    totalInvested: 0,
    availableWithdrawal: 0
  });
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real financial ledger, currency preference, and active allocations from the database API
  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        const [profileRes, ledgerRes, allocationsRes] = await Promise.all([
          fetch('/api/investments/profile'),
          fetch('/api/investments/ledger'),
          fetch('/api/investments/my-allocations')
        ]);

        const profileData = await profileRes.json();
        const ledgerData = await ledgerRes.json();
        const allocationsData = await allocationsRes.json();

        // Set currency symbol based on backend profile country/currency
        if (profileData.success && profileData.data?.currency) {
          const curr = profileData.data.currency;
          if (curr.includes('UGX')) setCurrencySymbol('USh ');
          else if (curr.includes('GHS')) setCurrencySymbol('₵ ');
          else if (curr.includes('ZAR')) setCurrencySymbol('R ');
          else setCurrencySymbol('₦ ');
        }

        if (ledgerData.success) {
          setLedger(ledgerData.ledger);
        } else {
          setError('Failed to load financial ledger data.');
        }

        if (allocationsData.success) {
          setAllocations(allocationsData.data);
        }
      } catch (err) {
        setError('Network error: Unable to fetch portfolio data from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        Syncing financial ledger from database...
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
            Database-Synced Portfolio
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Capital Ledger Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Live metrics pulled directly from your partitioned institutional financial records in local jurisdiction currency.
          </p>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 transition"
        >
          {showBalance ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          {showBalance ? 'Hide Amounts' : 'Show Amounts'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <FiAlertCircle size={18} /> {error}
        </div>
      )}

      {/* Split Cards Grid: Actual Balance, Daily Earned, Total Money Invested */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Actual Balance */}
        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actual Balance</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] flex items-center justify-center text-lg">
              <FiDollarShield />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white tracking-tight">
              {showBalance ? `${currencySymbol}${ledger.actualBalance?.toLocaleString()}` : '••••••••'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available uninvested deposits</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <Link to="/investor/deposits" className="flex-1 py-2 bg-[#0077B6] hover:bg-[#0096C7] text-white text-xs font-semibold rounded-lg text-center transition">
              Deposit
            </Link>
            <Link to="/investor/marketplace" className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#0B132B] dark:text-white text-xs font-semibold rounded-lg text-center transition">
              Invest
            </Link>
          </div>
        </div>

        {/* Card 2: Daily Earned */}
        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Daily Earned</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-[#2EC4B6] flex items-center justify-center text-lg">
              <FiTrendingUp />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white tracking-tight">
              {showBalance ? `${currencySymbol}${ledger.dailyEarned?.toLocaleString()}` : '••••'}
            </h3>
            <p className="text-xs text-emerald-600 dark:text-[#2EC4B6] font-medium mt-1">● Verified profit accrual</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to="/investor/dividends" className="text-xs font-semibold text-[#0077B6] dark:text-[#00F2FE] hover:underline flex items-center gap-1">
              View dividend history &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Total Money Invested */}
        <div className="bg-white dark:bg-[#1C2541] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Money Invested</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <FiLock />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0B132B] dark:text-white tracking-tight">
              {showBalance ? `${currencySymbol}${ledger.totalInvested?.toLocaleString()}` : '••••••••'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Locked principal across active pools</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to="/investor/allocations" className="text-xs font-semibold text-[#0077B6] dark:text-[#00F2FE] hover:underline flex items-center gap-1">
              View active allocations &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* Active Capital Allocations Database Table */}
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#0B132B] dark:text-white">Active Capital Allocations</h3>
          <Link to="/investor/allocations" className="text-xs font-semibold text-[#0077B6] dark:text-[#00F2FE] hover:underline">
            View All
          </Link>
        </div>
        
        {allocations.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No active capital allocations found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 uppercase text-xs">
                <tr>
                  <th className="p-3 rounded-l-lg">Offer Title</th>
                  <th className="p-3">Invested Principal</th>
                  <th className="p-3">Expected Return</th>
                  <th className="p-3">Maturity Status</th>
                  <th className="p-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {allocations.map((item) => (
                  <tr key={item._id}>
                    <td className="p-3 font-semibold text-[#0B132B] dark:text-white">{item.offerTitle}</td>
                    <td className="p-3">{currencySymbol}{item.amount?.toLocaleString()}</td>
                    <td className="p-3 text-emerald-600 dark:text-[#2EC4B6] font-medium">{item.expectedReturnRate}% P.A.</td>
                    <td className="p-3">{item.remainingDays} Days Remaining</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default InvestorHome;
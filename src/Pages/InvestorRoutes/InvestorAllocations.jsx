import React, { useState, useEffect } from 'react';
import { FiPieChart, FiLock, FiClock, FiAlertCircle } from 'react-icons/fi';

const InvestorAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('₦');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, allocRes] = await Promise.all([
          fetch('/api/investments/profile'),
          fetch('/api/investments/my-allocations')
        ]);
        const profileData = await profileRes.json();
        const allocData = await allocRes.json();

        if (profileData.success && profileData.data?.currency) {
          const curr = profileData.data.currency;
          if (curr.includes('UGX')) setCurrencySymbol('USh ');
          else if (curr.includes('GHS')) setCurrencySymbol('₵ ');
          else if (curr.includes('ZAR')) setCurrencySymbol('R ');
          else setCurrencySymbol('₦ ');
        }

        if (allocData.success) {
          setAllocations(allocData.data);
        } else {
          setError('Failed to fetch allocations from database.');
        }
      } catch (err) {
        setError('Network error connecting to database.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading portfolio allocations...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
          Portfolio Management
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Locked Capital Allocations</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Monitor your active principal commitments, time limits, and verified maturity schedules.
        </p>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2"><FiAlertCircle /> {error}</div>}

      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {allocations.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">No capital allocations found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 uppercase text-xs">
                <tr>
                  <th className="p-3 rounded-l-lg">Offer Title</th>
                  <th className="p-3">Locked Principal</th>
                  <th className="p-3">Expected Return</th>
                  <th className="p-3">Time Limit Status</th>
                  <th className="p-3 rounded-r-lg">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {allocations.map((item) => (
                  <tr key={item._id}>
                    <td className="p-3 font-semibold text-[#0B132B] dark:text-white">{item.offerTitle}</td>
                    <td className="p-3">{currencySymbol}{item.amount?.toLocaleString()}</td>
                    <td className="p-3 text-emerald-600 dark:text-[#2EC4B6] font-medium">{item.expectedReturnRate}% P.A.</td>
                    <td className="p-3 flex items-center gap-1.5"><FiClock size={14} /> {item.remainingDays} Days Left</td>
                    <td className="p-3"><span className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-medium">{item.status}</span></td>
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

export default InvestorAllocations;
import React, { useState, useEffect } from 'react';
import { FiGrid, FiClock, FiTrendingUp, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const InvestorMarketplace = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [allocationAmount, setAllocationAmount] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [allocating, setAllocating] = useState(false);

  // Fetch active offers published by the admin from the database API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/investments/offers');
        const data = await response.json();
        
        if (data.success) {
          setOffers(data.data);
        } else {
          setError('Failed to load investment offers.');
        }
      } catch (err) {
        setError('Network error: Unable to connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    setAllocating(true);
    setSuccessMsg('');
    setError('');

    try {
      const response = await fetch('/api/investments/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token headers if required by your setup
        },
        body: JSON.stringify({
          offerId: selectedOffer._id,
          amount: Number(allocationAmount)
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMsg(`Successfully allocated ₦${Number(allocationAmount).toLocaleString()} to ${selectedOffer.title}!`);
        setAllocationAmount('');
        setSelectedOffer(null);
      } else {
        setError(result.message || 'Allocation failed. Please check your available deposit balance.');
      }
    } catch (err) {
      setError('An error occurred while processing your capital allocation.');
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
            Database-Synced Marketplace
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Active Capital Allocation Pools</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Real-time investment opportunities published by administrators. Select an offer to deploy uninvested capital.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <FiAlertCircle size={18} /> {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          Loading published offers from database...
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No active investment offers published by the admin yet.</p>
        </div>
      ) : (
        /* Offers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-[#0077B6] dark:text-[#00F2FE] rounded-md">
                    {offer.status}
                  </span>
                  <span className="text-xs font-bold text-[#2A9D8F] dark:text-[#2EC4B6] flex items-center gap-1">
                    <FiTrendingUp /> {offer.expectedReturnRate}% P.A.
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0B132B] dark:text-white mb-2">{offer.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {offer.description}
                </p>

                <div className="space-y-2 py-4 border-t border-b border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Min Capital:</span>
                    <span className="font-semibold text-[#0B132B] dark:text-white">₦{offer.minCapital?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Capital:</span>
                    <span className="font-semibold text-[#0B132B] dark:text-white">₦{offer.maxCapital?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit (Lock Duration):</span>
                    <span className="font-semibold text-[#0B132B] dark:text-white flex items-center gap-1">
                      <FiClock size={12} /> {offer.timeLimit} Days
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOffer(offer)}
                className="w-full mt-6 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white text-sm font-semibold rounded-xl shadow transition"
              >
                Select & Allocate Capital
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Allocation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C2541] rounded-2xl max-w-md w-full p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold text-[#0B132B] dark:text-white mb-2">Allocate to {selectedOffer.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Enter the amount you wish to lock from your uninvested deposit balance for {selectedOffer.timeLimit} days.
            </p>

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Allocation Amount (Min: ₦{selectedOffer.minCapital?.toLocaleString()})
                </label>
                <input
                  type="number"
                  min={selectedOffer.minCapital}
                  max={selectedOffer.maxCapital}
                  required
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="e.g., 250000"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="flex-1 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold rounded-xl text-sm shadow disabled:opacity-50"
                >
                  {allocating ? 'Processing...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InvestorMarketplace;
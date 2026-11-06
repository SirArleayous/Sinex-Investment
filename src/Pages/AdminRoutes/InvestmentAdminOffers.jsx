import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const InvestmentAdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', minCapital: '', maxCapital: '', timeLimit: '', expectedReturnRate: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/investments/admin/offers')
      .then(res => res.json())
      .then(data => { if (data.success) setOffers(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch('/api/investments/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, minCapital: Number(formData.minCapital), maxCapital: Number(formData.maxCapital), timeLimit: Number(formData.timeLimit), expectedReturnRate: Number(formData.expectedReturnRate) })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg('Offer published successfully.');
        setOffers([...offers, data.data]);
        setFormData({ title: '', description: '', minCapital: '', maxCapital: '', timeLimit: '', expectedReturnRate: '' });
      } else {
        setMsg(data.message || 'Failed to publish offer.');
      }
    } catch (err) {
      setMsg('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0077B6] dark:text-[#00F2FE] text-xs font-semibold uppercase tracking-wider rounded-full">
          Offer Management
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white mt-2">Publish & Configure Offers</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Define investment pools, capital ceilings, and lock durations (timeLimit).</p>
      </div>

      {msg && <div className="p-4 bg-blue-100 text-blue-800 rounded-xl text-sm font-medium">{msg}</div>}

      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-[#0B132B] dark:text-white mb-4 flex items-center gap-2">
          <FiPlusCircle /> Create New Offer
        </h3>
        <form onSubmit={handleCreateOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Offer Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="Agricultural Fund Q1" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Return Rate (% P.A.)</label>
            <input type="number" step="0.1" name="expectedReturnRate" required value={formData.expectedReturnRate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="15.5" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Min Capital</label>
            <input type="number" name="minCapital" required value={formData.minCapital} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="50000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Max Capital</label>
            <input type="number" name="maxCapital" required value={formData.maxCapital} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="5000000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Time Limit (Days)</label>
            <input type="number" name="timeLimit" required value={formData.timeLimit} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="90" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
            <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white" placeholder="Venture details..." />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting} className="py-3 px-6 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold rounded-xl text-sm shadow transition disabled:opacity-50">
              {submitting ? 'Publishing...' : 'Publish Offer'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-[#1C2541] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#0B132B] dark:text-white mb-4">Active Database Offers</h3>
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : offers.length === 0 ? <p className="text-sm text-gray-500">No active offers published.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 uppercase text-xs">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Return Rate</th>
                  <th className="p-3">Time Limit</th>
                  <th className="p-3">Min/Max</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {offers.map(o => (
                  <tr key={o._id}>
                    <td className="p-3 font-semibold text-[#0B132B] dark:text-white">{o.title}</td>
                    <td className="p-3 text-emerald-600 font-medium">{o.expectedReturnRate}% P.A.</td>
                    <td className="p-3 flex items-center gap-1"><FiClock size={12} /> {o.timeLimit} Days</td>
                    <td className="p-3">₦{o.minCapital?.toLocaleString()} - ₦{o.maxCapital?.toLocaleString()}</td>
                    <td className="p-3"><span className="px-2.5 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full font-medium">{o.status}</span></td>
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

export default InvestmentAdminOffers;
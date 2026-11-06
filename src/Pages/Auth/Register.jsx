import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'Nigeria',
    currency: 'NGN (₦)',
    entityType: 'Individual',
    nin: '',
    bvnOrTaxId: '',
    bankName: '',
    accountNumber: '',
    sourceOfFunds: '',
    role: 'investor'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-update currency symbol based on selected country
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    let currencyVal = 'NGN (₦)';
    if (selectedCountry === 'Uganda') currencyVal = 'UGX (USh)';
    if (selectedCountry === 'Ghana') currencyVal = 'GHS (₵)';
    if (selectedCountry === 'South Africa') currencyVal = 'ZAR (R)';

    setFormData({
      ...formData,
      country: selectedCountry,
      currency: currencyVal
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Update display name in Firebase
      await updateProfile(user, {
        displayName: formData.name
      });

      // 3. Sync full 12-point investor compliance profile with MongoDB backend
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency,
          entityType: formData.entityType,
          nin: formData.nin,
          bvnOrTaxId: formData.bvnOrTaxId,
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber
          },
          sourceOfFunds: formData.sourceOfFunds,
          role: 'investor'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save institutional investor profile on server.');
      }

      // 4. Route directly to the Investor Dashboard
      navigate('/investor');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0B132B] px-4 py-10 transition-colors duration-200">
      <div className="max-w-3xl w-full bg-white dark:bg-[#1C2541] rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200 dark:border-gray-800">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE] bg-blue-50 dark:bg-blue-950/50 rounded-full">
            SINEX Investment Suite • 12-Point Compliance
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B132B] dark:text-white">Institutional Investor Onboarding</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Complete your verified profile to participate in pan-African capital allocation pools.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Section 1: Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE]">
              1. Account Information (Points 1–4)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  1. Full Legal Name / Entity Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="e.g., Aliko Ahmed / Ventures Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  2. Institutional Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="investor@domain.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  3. Secure Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  4. Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="+234 / +256 / +27 / +233"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Jurisdiction, Currency & Entity */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE]">
              2. Jurisdiction & Currency (Points 5–7)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  5. Operating Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  6. Base Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  readOnly
                  value={formData.currency}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-[#0B132B] dark:text-white font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  7. Investor Entity Type
                </label>
                <select
                  name="entityType"
                  value={formData.entityType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                >
                  <option value="Individual">Individual High-Net-Worth</option>
                  <option value="Corporate">Corporate Body / LLC</option>
                  <option value="Fund">Investment Fund / Syndicate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Verification (NIN & BVN / Tax ID) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE]">
              3. Statutory Compliance (Points 8–9)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  8. National Identification Number (NIN)
                </label>
                <input
                  type="text"
                  name="nin"
                  required
                  value={formData.nin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="Enter 11-digit NIN or national ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  9. BVN / Tax Identification Number (TIN)
                </label>
                <input
                  type="text"
                  name="bvnOrTaxId"
                  required
                  value={formData.bvnOrTaxId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="Enter BVN (Nigeria) or Tax ID"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Banking & Capital Source */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE]">
              4. Banking & Financial Details (Points 10–12)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  10. Bank Name / Mobile Money Provider
                </label>
                <input
                  type="text"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="e.g., Zenith Bank, MTN MoMo, Stanbic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  11. Account Number / Mobile Wallet Phone
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  required
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                  placeholder="Enter account number or wallet number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                12. Source of Invested Capital / Origin
              </label>
              <input
                type="text"
                name="sourceOfFunds"
                required
                value={formData.sourceOfFunds}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:ring-2 focus:ring-[#0077B6]"
                placeholder="e.g., Business Revenue, Corporate Treasury, Real Estate Liquidation"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold rounded-xl shadow-lg transition duration-200 disabled:opacity-50 mt-4"
          >
            {loading ? 'Verifying & Initializing Account...' : 'Complete 12-Point Institutional Registration'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already registered as an investor?{' '}
          <Link to="/login" className="text-[#0077B6] dark:text-[#00F2FE] font-medium hover:underline">
            Sign in to Portal
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate investor with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Fetch user profile from backend to verify investor role and status
      const response = await fetch(`/api/users/profile/${user.uid}`);
      const data = await response.json();

      const userRole = data?.role || 'investor';

      // 3. Security check: Ensure they belong to the investor portal
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        // Default routing for registered institutional investors
        navigate('/investor');
      }
    } catch (err) {
      setError('Invalid credentials or unauthorized access. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0B132B] px-4 py-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1C2541] rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#0077B6] dark:text-[#00F2FE] bg-blue-50 dark:bg-blue-950/50 rounded-full">
            SINEX Investment Suite
          </div>
          <h2 className="text-3xl font-bold text-[#0B132B] dark:text-white">Investor Portal Sign In</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Access your secure institutional dashboard and live capital allocation portfolios.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Institutional Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              placeholder="investor@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Secure Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0B132B] text-[#0B132B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold rounded-xl shadow-lg transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating Secure Session...' : 'Sign In to Portal'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          New institutional investor?{' '}
          <Link to="/register" className="text-[#0077B6] dark:text-[#00F2FE] font-medium hover:underline">
            Complete 12-point onboarding
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
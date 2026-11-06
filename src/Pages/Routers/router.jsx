import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Auth Pages
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';

// Investor Dashboard Layout & Tabs
import InvestorLayout from '../Pages/InvestorRoutes/InvestorLayout';
import InvestorHome from '../Pages/InvestorRoutes/InvestorHome';
import InvestorMarketplace from '../Pages/InvestorRoutes/InvestorMarketplace';
import InvestorAllocations from '../Pages/InvestorRoutes/InvestorAllocations';
import InvestorDeposits from '../Pages/InvestorRoutes/InvestorDeposits';
import InvestorAnalytics from '../Pages/InvestorRoutes/InvestorAnalytics';
import InvestorDividends from '../Pages/InvestorRoutes/InvestorDividends';
import InvestorBanking from '../Pages/InvestorRoutes/InvestorBanking';
import InvestorWithdrawals from '../Pages/InvestorRoutes/InvestorWithdrawals';
import InvestorLeaderboard from '../Pages/InvestorRoutes/InvestorLeaderboard';
import { InvestorProfile, InvestorSettings } from '../Pages/InvestorRoutes/InvestorProfileAndSettings';

// Investment Admin Control Centre
import InvestmentAdmin from '../Pages/AdminRoutes/InvestmentAdmin';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/investor',
    element: <InvestorLayout />,
    children: [
      { index: true, element: <InvestorHome /> },
      { path: 'marketplace', element: <InvestorMarketplace /> },
      { path: 'allocations', element: <InvestorAllocations /> },
      { path: 'deposits', element: <InvestorDeposits /> },
      { path: 'analytics', element: <InvestorAnalytics /> },
      { path: 'dividends', element: <InvestorDividends /> },
      { path: 'banking', element: <InvestorBanking /> },
      { path: 'withdrawals', element: <InvestorWithdrawals /> },
      { path: 'leaderboard', element: <InvestorLeaderboard /> },
      { path: 'profile', element: <InvestorProfile /> },
      { path: 'settings', element: <InvestorSettings /> }
    ]
  },
  {
    path: '/admin/investments',
    element: <InvestmentAdmin />
  }
]);

export default router;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';

// Lazy loading pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Discover = React.lazy(() => import('./pages/Discover'));
const Roadmap = React.lazy(() => import('./pages/Roadmap'));
const Network = React.lazy(() => import('./pages/Network'));
const AiAdvisor = React.lazy(() => import('./pages/AiAdvisor'));
const Profile = React.lazy(() => import('./pages/Profile'));
const CareerTrack = React.lazy(() => import('./pages/CareerTrack'));

// Fallback loader
const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50">
    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <React.Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/network" element={<Network />} />
            <Route path="/advisor" element={<AiAdvisor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/career/:trackId" element={<CareerTrack />} />
          </Route>
        </Routes>
      </React.Suspense>
    </AppProvider>
  );
}

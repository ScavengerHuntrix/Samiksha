import React from 'react';
import { Outlet } from 'react-router-dom';
import { SimulationBanner } from '../components/SimulationBanner';
import { NSWSHeader } from '../components/NSWSHeader';
import { NSWSFooter } from '../components/NSWSFooter';

export const NSWSLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <SimulationBanner />
      <NSWSHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <NSWSFooter />
    </div>
  );
};

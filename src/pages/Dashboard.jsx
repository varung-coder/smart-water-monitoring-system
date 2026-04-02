import React from 'react';
import Navbar from '../components/Navbar';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';
import UserNotifications from '../components/UserNotifications';
import { Droplets, Shield } from 'lucide-react';

const ADMIN_EMAIL = 'varung3186@gmail.com';

function Dashboard({ user }) {
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="animated-bg min-h-screen">
      {/* Subtle blobs in dashboard too */}
      <div className="blob blob-1" style={{ opacity: 0.12 }} />
      <div className="blob blob-2" style={{ opacity: 0.10 }} />

      {!isAdmin && <UserNotifications user={user} />}

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-screen">
        <Navbar user={user} />

        {/* Admin badge */}
        {isAdmin && (
          <div className="mb-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 text-sm w-fit">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Admin Mode</span>
            <span className="text-yellow-400/70 text-xs">— You can verify and resolve reports</span>
          </div>
        )}

        {/* Main grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <ReportForm user={user} />

            {/* Info card */}
            <div className="glass-card p-5 hidden lg:block">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="h-4 w-4 text-cyan-400" />
                <h3 className="font-semibold text-sm text-cyan-100">Why report water issues?</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Timely reporting enables authorities to respond quickly, preventing waterborne 
                diseases and conserving resources. Your reports are reviewed by admins and tracked 
                through <span className="text-yellow-300">Reported</span> → <span className="text-blue-300">Verified</span> → <span className="text-green-300">Resolved</span>.
              </p>
            </div>
          </div>

          {/* Right column — report list */}
          <div className="lg:col-span-7 lg:h-[calc(100vh-11rem)] min-h-[500px]">
            <ReportList user={user} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

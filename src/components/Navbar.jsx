import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Droplets } from 'lucide-react';

function Navbar({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="glass-card mb-8 px-5 py-3.5 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-600/30 border border-white/15">
          <Droplets className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
            Smart Water Monitor
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">Quality Tracking System</p>
        </div>
      </div>

      {/* User info + logout */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-white leading-tight">{user.displayName}</span>
            <span className="text-xs text-gray-400">{user.email}</span>
          </div>
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=0891b2&color=fff`}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-cyan-400/40 shadow-md"
          />
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 text-gray-300 hover:text-red-300 transition-all duration-200 text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

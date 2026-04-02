import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center p-4">
      {/* Floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Glow behind card */}
      <div className="login-glow" />

      {/* Login Card */}
      <div className="glass-card login-card relative max-w-md w-full p-8 md:p-10 text-center z-10">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400" />

        {/* Animated water drop icon */}
        <div className="relative mx-auto mb-6 w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 animate-pulse" />
          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-white/10 border border-white/20">
            <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M32 4C32 4 12 26 12 38C12 49.046 21.073 58 32 58C42.927 58 52 49.046 52 38C52 26 32 4 32 4Z"
                fill="url(#dropGrad)"
                className="drop-shadow-lg"
              />
              <path
                d="M22 40C22 40 20 46 28 48"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="dropGrad" x1="32" y1="4" x2="32" y2="58" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
          Smart Water Monitoring
        </h1>
        <p className="text-gray-300 text-sm mb-8 leading-relaxed font-light">
          Report and track water-related issues in your community.<br />
          Together, let's ensure clean water for everyone.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-lg">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-btn w-full bg-white text-gray-800 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2 text-gray-600">
              <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Signing in...
            </span>
          ) : (
            <>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </button>

        {/* Footer text */}
        <p className="mt-6 text-xs text-gray-400">
          Secure sign-in powered by Firebase Authentication
        </p>
      </div>
    </div>
  );
}

export default Login;

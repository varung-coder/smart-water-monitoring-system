import React, { useEffect, useState } from 'react';

function StatusNotification({ notification, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isResolved = notification.type === 'Resolved';

  const config = isResolved
    ? {
        emoji: '🎉',
        smiley: '😊',
        title: 'Your Problem Has Been Resolved!',
        message: 'Thank you for reporting. The issue has been fixed by our team.',
        tagline: 'Feel free to share more problems with us anytime!',
        gradientFrom: 'from-green-400',
        gradientTo: 'to-cyan-400',
        glowColor: 'rgba(34,197,94,0.35)',
        badgeClass: 'bg-green-500/20 text-green-300 border-green-500/30',
        badgeLabel: '✅ Resolved',
      }
    : {
        emoji: '🔍',
        smiley: '😊',
        title: 'Your Report Has Been Verified!',
        message: 'Our admin has reviewed and verified your report. We\'re working on it.',
        tagline: 'Thank you for helping keep the community safe!',
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-cyan-400',
        glowColor: 'rgba(59,130,246,0.35)',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        badgeLabel: '🔵 Verified',
      };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
          opacity: visible ? 1 : 0,
        }}
        className="glass-card max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        {/* Top gradient bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo}`} />

        {/* Background glow */}
        <div
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '280px', height: '280px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        {/* Emoji burst */}
        <div className="relative flex justify-center gap-3 mb-4 text-4xl">
          <span style={{ animation: 'bounceIn 0.6s ease forwards' }}>{config.emoji}</span>
          <span style={{ animation: 'bounceIn 0.6s ease 0.1s both' }}>{config.smiley}</span>
          <span style={{ animation: 'bounceIn 0.6s ease 0.2s both' }}>{config.emoji}</span>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${config.badgeClass}`}>
          {config.badgeLabel}
        </span>

        {/* Title */}
        <h2 className="text-xl font-extrabold text-white mb-3 leading-tight">
          {config.title}
        </h2>

        {/* Report details pill */}
        <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 mb-4 text-sm text-left">
          <p className="text-gray-300 mb-1">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Location</span><br />
            <span className="text-white font-medium">{notification.location}</span>
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400 text-xs uppercase tracking-wide">Issue</span><br />
            <span className="text-white font-medium capitalize">{notification.issueType}</span>
          </p>
        </div>

        <p className="text-gray-200 text-sm mb-2">{config.message}</p>

        {/* Tagline with smiley */}
        <p className="text-cyan-200 text-sm font-medium mb-6">
          {config.tagline} 😊
        </p>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} hover:opacity-90 transition-all shadow-lg`}
        >
          Got it, Thanks! 👍
        </button>

        {/* Auto-close hint */}
        <p className="text-xs text-gray-500 mt-3">This notification will close automatically</p>
      </div>

      <style>{`
        @keyframes bounceIn {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg); }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default StatusNotification;

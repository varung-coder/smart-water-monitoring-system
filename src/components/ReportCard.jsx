import React from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { MapPin, Clock, AlertTriangle, Droplets, Waves, CheckCircle, ShieldCheck } from 'lucide-react';

const ADMIN_EMAIL = 'varung3186@gmail.com';

const ISSUE_ICONS = {
  contamination: <AlertTriangle className="h-4 w-4 text-red-400" />,
  leakage:       <Droplets className="h-4 w-4 text-blue-400" />,
  'dirty water': <Waves className="h-4 w-4 text-orange-400" />,
  'low pressure': <Droplets className="h-4 w-4 text-purple-400" />,
  other:         <AlertTriangle className="h-4 w-4 text-gray-400" />,
};

const ISSUE_COLORS = {
  contamination: 'bg-red-500/15 text-red-300 border-red-500/25',
  leakage:       'bg-blue-500/15 text-blue-300 border-blue-500/25',
  'dirty water': 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  'low pressure':'bg-purple-500/15 text-purple-300 border-purple-500/25',
  other:         'bg-gray-500/15 text-gray-300 border-gray-500/25',
};

function StatusBadge({ status }) {
  const config = {
    Reported: { cls: 'badge-reported', icon: '🟡', label: 'Reported' },
    Verified: { cls: 'badge-verified', icon: '🔵', label: 'Verified' },
    Resolved: { cls: 'badge-resolved', icon: '🟢', label: 'Resolved' },
    Pending:  { cls: 'badge-reported', icon: '🟡', label: 'Pending' }, // backwards compat
  }[status] || { cls: 'badge-reported', icon: '🟡', label: status };

  return (
    <span key={status} className={`badge ${config.cls}`}>
      {config.icon} {config.label}
    </span>
  );
}

function ReportCard({ report, userEmail }) {
  const isAdmin = userEmail === ADMIN_EMAIL;
  const isResolved = report.status === 'Resolved';
  const isVerified = report.status === 'Verified';
  const issueKey = (report.issueType || '').toLowerCase();

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'reports', report.id), { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return 'Just now';
    return new Date(ts.seconds * 1000).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className={`glass-card glass-card-hover report-card p-5 ${isResolved ? 'opacity-60' : ''}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg border shrink-0 ${ISSUE_COLORS[issueKey] || 'bg-gray-500/15 text-gray-300 border-gray-500/25'}`}>
            {ISSUE_ICONS[issueKey] || ISSUE_ICONS.other}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white capitalize text-sm leading-tight truncate">
              {report.issueType}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0 text-cyan-400" />
              <span className="truncate">{report.location}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={report.status || 'Reported'} />
      </div>

      {/* Description */}
      <p className="text-gray-200 text-sm leading-relaxed bg-black/15 rounded-lg p-3 mb-3 border border-white/5">
        {report.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/8">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-cyan-400/70" />
          <span>{formatDate(report.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img
            src={report.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.userName)}&size=24&background=0891b2&color=fff`}
            alt={report.userName}
            className="w-5 h-5 rounded-full border border-white/20"
          />
          <span className="text-gray-300 font-medium truncate max-w-[120px]">{report.userName}</span>
        </div>
      </div>

      {/* Admin controls */}
      {isAdmin && !isResolved && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/8">
          {!isVerified && (
            <button
              onClick={() => handleUpdateStatus('Verified')}
              className="btn-verify flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verify
            </button>
          )}
          <button
            onClick={() => handleUpdateStatus('Resolved')}
            className="btn-resolve flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500/15 hover:bg-green-500/30 text-green-300 border border-green-500/30 text-xs font-semibold"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportCard;

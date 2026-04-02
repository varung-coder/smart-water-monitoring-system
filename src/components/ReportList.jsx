import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ReportCard from './ReportCard';
import { Activity, Droplets, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

function StatPill({ icon, label, value, color }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}>
      {icon}
      <span>{label}:</span>
      <span className="font-bold count-badge">{value}</span>
    </div>
  );
}

function ReportList({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReports(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const counts = {
    All:      reports.length,
    Reported: reports.filter(r => (r.status === 'Reported' || r.status === 'Pending')).length,
    Verified: reports.filter(r => r.status === 'Verified').length,
    Resolved: reports.filter(r => r.status === 'Resolved').length,
  };

  const filtered = filter === 'All'
    ? reports
    : filter === 'Reported'
      ? reports.filter(r => r.status === 'Reported' || r.status === 'Pending')
      : reports.filter(r => r.status === filter);

  const FILTERS = ['All', 'Reported', 'Verified', 'Resolved'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Activity className="h-4 w-4 text-cyan-300" />
          </span>
          Live Reports
        </h2>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2">
          <StatPill
            icon={<Droplets className="h-3 w-3" />}
            label="Total" value={counts.All}
            color="bg-white/8 text-gray-300 border-white/12"
          />
          <StatPill
            icon={<Clock className="h-3 w-3" />}
            label="Reported" value={counts.Reported}
            color="bg-yellow-500/10 text-yellow-300 border-yellow-500/25"
          />
          <StatPill
            icon={<AlertTriangle className="h-3 w-3" />}
            label="Verified" value={counts.Verified}
            color="bg-blue-500/10 text-blue-300 border-blue-500/25"
          />
          <StatPill
            icon={<CheckCircle className="h-3 w-3" />}
            label="Resolved" value={counts.Resolved}
            color="bg-green-500/10 text-green-300 border-green-500/25"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === f
                ? 'bg-cyan-500/30 text-cyan-200 border-cyan-500/50'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f} {f !== 'All' && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Report list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="spinner" />
            <p className="text-sm text-gray-400 animate-pulse">Fetching reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center h-48 gap-3 text-center p-8">
            <Activity className="h-10 w-10 text-white/20" />
            <p className="text-gray-400 text-sm">
              {filter === 'All' ? 'No reports yet. Be the first to report an issue!' : `No ${filter.toLowerCase()} reports.`}
            </p>
          </div>
        ) : (
          filtered.map((report, i) => (
            <div key={report.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ReportCard report={report} userEmail={user?.email} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReportList;

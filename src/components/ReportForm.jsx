import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, MapPin, FileText, AlertCircle, ChevronDown } from 'lucide-react';
import Toast from './Toast';

const ISSUE_TYPES = [
  { value: 'contamination', label: '⚗️ Contamination', desc: 'Chemical or biological pollutants' },
  { value: 'leakage',       label: '💧 Leakage / Broken Pipe', desc: 'Water escaping from pipes' },
  { value: 'dirty water',   label: '🟤 Dirty / Muddy Water', desc: 'Discoloured or cloudy water' },
  { value: 'low pressure',  label: '📉 Low Water Pressure', desc: 'Insufficient water flow' },
  { value: 'other',         label: '📋 Other', desc: 'Any other water issue' },
];

function ReportForm({ user }) {
  const [formData, setFormData] = useState({ location: '', issueType: 'contamination', description: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.description.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        ...formData,
        location: formData.location.trim(),
        description: formData.description.trim(),
        userName: user.displayName,
        userEmail: user.email,
        userPhoto: user.photoURL || '',
        timestamp: serverTimestamp(),
        status: 'Reported',
      });
      setFormData({ location: '', issueType: 'contamination', description: '' });
      showToast('Report submitted successfully!', 'success');
    } catch (error) {
      console.error('Error adding document:', error);
      showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="glass-card p-6 md:p-7 relative overflow-hidden">
        {/* Left accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b from-cyan-400 via-blue-500 to-green-400" />

        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <AlertCircle className="h-4 w-4 text-cyan-300" />
          </span>
          Report an Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="glass-input"
              placeholder="e.g., Downtown Sector 4, Main Street"
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Issue Type
            </label>
            <div className="relative">
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="glass-input appearance-none pr-10 cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              >
                {ISSUE_TYPES.map(t => (
                  <option key={t.value} value={t.value} className="bg-gray-900 text-white">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyan-400" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="glass-input resize-none"
              placeholder="Describe the issue in detail — what you observed, severity, etc."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.location.trim() || !formData.description.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-cyan-500/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ReportForm;

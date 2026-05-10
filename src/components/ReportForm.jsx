import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Send, MapPin, FileText, AlertCircle, ChevronDown, ImagePlus, X } from 'lucide-react';
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

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      showToast('Only JPG, JPEG, and PNG files are allowed.', 'error');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `report-images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.description.trim()) return;

    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await addDoc(collection(db, 'reports'), {
        ...formData,
        location: formData.location.trim(),
        description: formData.description.trim(),
        userName: user.displayName,
        userEmail: user.email,
        userPhoto: user.photoURL || '',
        imageUrl,
        timestamp: serverTimestamp(),
        status: 'Reported',
      });

      setFormData({ location: '', issueType: 'contamination', description: '' });
      removeImage();
      showToast('Report submitted successfully!', 'success');
    } catch (error) {
      console.error('Error adding document:', error);
      showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
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

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <ImagePlus className="h-3.5 w-3.5 text-cyan-400" /> Upload Image <span className="text-gray-500 normal-case font-normal">(optional)</span>
            </label>

            {!imagePreview ? (
              <label
                htmlFor="report-image-upload"
                className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 gap-2"
              >
                <ImagePlus className="h-6 w-6 text-cyan-400/70" />
                <span className="text-xs text-gray-400">Click to upload <span className="text-cyan-400 font-medium">JPG, JPEG, PNG</span></span>
                <input
                  id="report-image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/20">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white border border-white/20 transition-all duration-200"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="px-3 py-1.5 text-xs text-gray-400 flex items-center gap-1.5">
                  <ImagePlus className="h-3 w-3 text-cyan-400" />
                  <span className="truncate max-w-[200px]">{imageFile?.name}</span>
                </div>
              </div>
            )}

            {/* Upload progress bar */}
            {loading && imageFile && uploadProgress > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Uploading image…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
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
                Submitting…
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

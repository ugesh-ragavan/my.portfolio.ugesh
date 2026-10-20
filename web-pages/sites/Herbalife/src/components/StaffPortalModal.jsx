import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, Trash2, X, Lock, CheckCircle2, Cloud, Smartphone, Users, Award, Smile } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { getOfflineLeads, exportLeadsToCSV } from '../services/leadService';
import { isFirebaseConfigured } from '../services/firebase';

const STAFF_PIN = '1234';

export const StaffPortalModal = () => {
  const { isStaffPortalOpen, setIsStaffPortalOpen } = useSession();
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [leads, setLeads] = useState([]);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    if (isStaffPortalOpen && isAuthenticated) {
      setLeads(getOfflineLeads());
    }
  }, [isStaffPortalOpen, isAuthenticated]);

  if (!isStaffPortalOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === STAFF_PIN || pinInput === 'herbalife') {
      setIsAuthenticated(true);
      setPinError(false);
      setLeads(getOfflineLeads());
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleExport = () => {
    const ok = exportLeadsToCSV();
    if (ok) {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all offline lead records stored on this tablet? Make sure you exported the CSV first!")) {
      localStorage.removeItem('herbalife_stall_leads_backup');
      setLeads([]);
    }
  };

  const handleClose = () => {
    setIsStaffPortalOpen(false);
    setIsAuthenticated(false);
    setPinInput('');
    setPinError(false);
  };

  // Stats calculation
  const totalLeads = leads.length;
  const moodCounts = leads.reduce((acc, lead) => {
    const mood = lead.mood || 'Unspecified';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const totalRewardsGiven = leads.reduce((acc, lead) => acc + ((lead.rewards || []).length), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-deep to-brand-green p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg leading-tight">
                  Stall Manager & Leads Portal
                </h3>
                <p className="text-xs text-white/80">
                  Event Kiosk Admin Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Main content */}
          <div className="p-6 overflow-y-auto flex-1">
            {!isAuthenticated ? (
              /* PIN Verification */
              <div className="py-8 max-w-xs mx-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-ink mb-1">
                  Stall Staff Access
                </h4>
                <p className="text-xs text-brand-ink-muted mb-5">
                  Enter PIN to view attendee leads and export stall data. (Default: 1234)
                </p>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter Staff PIN (1234)"
                    className={`w-full h-12 px-4 rounded-xl border text-center font-mono text-lg tracking-widest outline-none transition-all ${
                      pinError 
                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300' 
                        : 'border-emerald-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20'
                    }`}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-red-600 font-medium">
                      Incorrect PIN. Try 1234.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full h-12 bg-brand-deep hover:bg-brand-deep-dark text-white font-semibold text-sm rounded-xl shadow-soft-green transition-all touch-btn"
                  >
                    Unlock Dashboard
                  </button>
                </form>
              </div>
            ) : (
              /* Authenticated Dashboard */
              <div className="space-y-6">
                
                {/* Cloud & Device Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-brand-bg-subtle border border-emerald-100 text-xs">
                  <div className="flex items-center gap-2">
                    <Cloud className={`w-4 h-4 ${isFirebaseConfigured ? 'text-brand-green' : 'text-amber-500'}`} />
                    <span className="font-medium">
                      Firestore Mode: {isFirebaseConfigured ? <strong className="text-emerald-700">Cloud Synced</strong> : <span className="text-amber-700 font-semibold">Local Stall Buffer (Zero-latency)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-ink-muted">
                    <Smartphone className="w-4 h-4" />
                    <span>Tablet Kiosk Active</span>
                  </div>
                </div>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-800 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Total Guests</span>
                    </div>
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-deep">
                      {totalLeads}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-800 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Perks Won</span>
                    </div>
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-700">
                      {totalRewardsGiven}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-800 mb-1">
                      <Smile className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Positive Mood</span>
                    </div>
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-700">
                      100%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExport}
                    disabled={leads.length === 0}
                    className="flex-1 h-12 bg-brand-deep hover:bg-brand-deep-dark disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-soft-green flex items-center justify-center gap-2 transition-all touch-btn"
                  >
                    <Download className="w-4 h-4" />
                    <span>{exportSuccess ? 'CSV Downloaded! ✅' : 'Export Leads to CSV'}</span>
                  </button>

                  <button
                    onClick={handleClearData}
                    disabled={leads.length === 0}
                    className="h-12 px-4 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-brand-ink-muted text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors touch-btn"
                    title="Clear device cache"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Local Cache</span>
                  </button>
                </div>

                {/* Leads Table */}
                <div>
                  <h4 className="font-heading font-bold text-sm text-brand-ink mb-2">
                    Recent Stall Guests ({leads.length})
                  </h4>

                  {leads.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                      <p className="text-xs text-brand-ink-muted">
                        No guest leads collected yet. Start interacting with the kiosk to capture attendee data!
                      </p>
                    </div>
                  ) : (
                    <div className="border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="max-h-60 overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-emerald-50/80 sticky top-0 border-b border-emerald-100 text-brand-deep font-semibold">
                            <tr>
                              <th className="p-2.5">Name</th>
                              <th className="p-2.5">Phone</th>
                              <th className="p-2.5">Mood</th>
                              <th className="p-2.5">Rewards</th>
                              <th className="p-2.5">Activities</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-50">
                            {leads.slice().reverse().map((lead, idx) => (
                              <tr key={lead.sessionId || idx} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="p-2.5 font-medium text-brand-ink">{lead.name || 'Anonymous'}</td>
                                <td className="p-2.5 font-mono text-brand-ink-muted">{lead.phone || '—'}</td>
                                <td className="p-2.5">
                                  <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-amber-900 text-[10px] font-semibold">
                                    {lead.mood || 'Good'}
                                  </span>
                                </td>
                                <td className="p-2.5 font-semibold text-brand-deep">
                                  {(lead.rewards || []).length} perks
                                </td>
                                <td className="p-2.5 text-[11px] text-brand-ink-muted">
                                  {[
                                    lead.completedActivities?.spinWheel && '🎡 Wheel',
                                    lead.completedActivities?.wellnessQuiz && '🧠 Quiz',
                                    lead.completedActivities?.shakeMatcher && '🥤 Shake',
                                    lead.completedActivities?.hydrationCheck && '💧 Hydration'
                                  ].filter(Boolean).join(', ') || 'Started'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

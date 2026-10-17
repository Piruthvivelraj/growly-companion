import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code,
  LogOut,
  User,
  ShieldCheck,
  Smartphone,
  QrCode
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';

export default function Settings({ onOpenSqlModal, onOpenDownloadModal }) {
  const { theme, setTheme } = useTheme();
  const { user, isDemoMode, isSupabaseConfigured, logout } = useAuth();
  const { habits, completions, plantState, reflections, weightLogs } = useHabits();

  const [exportSuccess, setExportSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  // Export JSON backup
  const handleExportData = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      habits,
      completions,
      plantState,
      reflections,
      weightLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growly_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Import JSON backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.habits && Array.isArray(parsed.habits)) {
          localStorage.setItem('growly_habits', JSON.stringify(parsed.habits));
          if (parsed.completions) localStorage.setItem('growly_completions', JSON.stringify(parsed.completions));
          if (parsed.plantState) localStorage.setItem('growly_plant_state', JSON.stringify(parsed.plantState));
          if (parsed.reflections) localStorage.setItem('growly_reflections', JSON.stringify(parsed.reflections));
          if (parsed.weightLogs) localStorage.setItem('growly_weight_logs', JSON.stringify(parsed.weightLogs));

          setImportStatus('Data successfully restored! Refreshing app...');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus('Invalid GROWLY backup file format.');
        }
      } catch (err) {
        setImportStatus('Error parsing file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Clear demo data
  const handleResetData = () => {
    if (window.confirm('Reset all habits and progress to default starter values?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.65rem' }}>Settings & Cloud Sync</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Manage your cloud connection, appearance, and local offline backups.
        </p>
      </div>

      {/* Supabase & Account Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: isDemoMode ? 'var(--accent-amber-soft)' : 'var(--accent-forest-soft)',
                color: isDemoMode ? 'var(--accent-amber)' : 'var(--accent-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                  {isDemoMode ? 'Local Demo Mode' : 'Connected to Supabase'}
                </span>
                <span className={`badge ${isDemoMode ? 'badge-amber' : 'badge-forest'}`}>
                  {isDemoMode ? 'No Cloud Credentials' : 'Cloud Sync Active'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isDemoMode
                  ? 'All data is saved locally in persistent device storage.'
                  : `Signed in as ${user?.email}`}
              </p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onOpenSqlModal}>
            <Code size={14} /> View Supabase SQL Schema
          </button>
        </div>

        {isDemoMode ? (
          <div style={{ background: 'var(--bg-surface-soft)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            To enable Supabase multi-device cloud sync, add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file. No service-role key is ever exposed.
          </div>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={logout}>
            <LogOut size={14} /> Log Out
          </button>
        )}
      </div>

      {/* Mobile App & Android APK Card */}
      <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-forest-soft)',
                color: 'var(--accent-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smartphone size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>Mobile App & Android APK</span>
                <span className="badge badge-forest">v1.0.0 Ready</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Install directly on Android phones or use as an installable Web App (PWA).
              </p>
            </div>
          </div>

          <button className="btn btn-primary btn-sm" onClick={onOpenDownloadModal}>
            <QrCode size={14} /> Download APK / Scan QR
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '12px', fontSize: '0.82rem' }}>
          <div style={{ background: 'var(--bg-surface-soft)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Android APK (Native)</div>
            <div style={{ color: 'var(--text-secondary)' }}>Exact background alarms, persistent lock-screen reminders, offline sync.</div>
          </div>
          <div style={{ background: 'var(--bg-surface-soft)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Web App (PWA)</div>
            <div style={{ color: 'var(--text-secondary)' }}>Add to home screen instantly without downloading files. iOS & Android.</div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Theme & Appearance</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setTheme('light')}
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            <Sun size={16} /> Warm Porcelain (Light)
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            <Moon size={16} /> Spruce Midnight (Dark)
          </button>
        </div>
      </div>

      {/* Data Backup & Export */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Offline Backup & Portability</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          You always own your data. Export a full JSON archive or restore anytime.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportData}>
            <Download size={15} /> Export Backup JSON
          </button>

          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={15} /> Import Backup JSON
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportData}
            />
          </label>
        </div>

        {exportSuccess && (
          <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--accent-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> Backup file downloaded successfully!
          </div>
        )}

        {importStatus && (
          <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--accent-forest)' }}>
            {importStatus}
          </div>
        )}
      </div>

      {/* Reset Section */}
      <div className="card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>Reset Workspace</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Clear device storage and reset to clean initial state.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" style={{ color: 'var(--accent-danger)' }} onClick={handleResetData}>
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}

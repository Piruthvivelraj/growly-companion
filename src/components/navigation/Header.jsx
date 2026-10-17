import React from 'react';
import { Sprout, Sun, Moon, HeartHandshake, CloudOff, CloudCheck, Smartphone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenComeback, onOpenPlantDetails, onOpenDownloadModal }) {
  const { theme, toggleTheme } = useTheme();
  const { isDemoMode, isSupabaseConfigured } = useAuth();

  return (
    <header className="app-header">
      {/* Brand */}
      <div className="header-brand" style={{ cursor: 'pointer' }} onClick={onOpenPlantDetails}>
        <div className="header-brand-icon">
          <Sprout size={18} />
        </div>
        <span>GROWLY</span>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Get Mobile App (APK & PWA) Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenDownloadModal}
          style={{
            fontSize: '0.78rem',
            padding: '5px 10px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            gap: '5px'
          }}
          title="Download Android APK or Install Web App"
        >
          <Smartphone size={14} style={{ color: 'var(--accent-forest)' }} />
          <span style={{ display: 'inline' }}>Get App</span>
        </button>

        {/* Supabase Status / Demo Mode Indicator */}
        <span
          className={`badge ${isDemoMode ? 'badge-amber' : 'badge-forest'}`}
          title={isDemoMode ? 'Running in Local Demo Mode (No cloud credentials configured)' : 'Connected to Supabase'}
          style={{ fontSize: '0.68rem', padding: '3px 7px' }}
        >
          {isDemoMode ? (
            <>
              <CloudOff size={11} /> Demo Mode
            </>
          ) : (
            <>
              <CloudCheck size={11} /> Cloud Sync
            </>
          )}
        </span>

        {/* Gentle Comeback Quick Action */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onOpenComeback}
          style={{ color: 'var(--accent-terracotta)', fontWeight: '700', padding: '6px 10px' }}
          title="Felt overwhelmed or missed a day? Open gentle recovery"
        >
          <HeartHandshake size={16} />
          <span style={{ display: 'none' }}>Recover</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          style={{ width: '36px', height: '36px' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

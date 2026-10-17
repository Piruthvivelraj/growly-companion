import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Globe,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Share2,
  ExternalLink,
  ShieldCheck,
  BellRing,
  WifiOff,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import QrCodeView from '../common/QrCodeView';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function DownloadAppModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('apk'); // 'apk' | 'pwa' | 'guide'
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { isInstallable, isStandalone, promptInstall } = usePwaInstall();

  // Retrieve custom APK URL if set in localStorage, otherwise default to local downloads path
  const customApkUrl = typeof window !== 'undefined' ? localStorage.getItem('growly_custom_apk_url') : '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const apkDownloadUrl = customApkUrl || `${currentOrigin}/downloads/GROWLY.apk`;

  // Direct download handler
  const handleDownloadApk = () => {
    setIsDownloading(true);

    // If an actual file exists at apkDownloadUrl, trigger download
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.setAttribute('download', 'GROWLY.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(apkDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GROWLY — Download Android App',
          text: 'Get the GROWLY habit and personal growth companion app for Android!',
          url: apkDownloadUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: 'var(--space-md)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-forest-soft)',
                color: 'var(--accent-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Get GROWLY for Mobile</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Use as a web app or install the Android APK
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '4px',
            backgroundColor: 'var(--bg-surface-soft)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={() => setActiveTab('apk')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'apk' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'apk' ? 'var(--accent-forest)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'apk' ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'apk' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Smartphone size={15} /> Android APK
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'pwa' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'pwa' ? 'var(--accent-forest)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'pwa' ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'pwa' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Globe size={15} /> Web App (PWA)
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'guide' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'guide' ? 'var(--accent-forest)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'guide' ? '700' : '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'guide' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShieldCheck size={15} /> Install Guide
          </button>
        </div>

        {/* Tab 1: Android APK */}
        {activeTab === 'apk' && (
          <div>
            {/* Primary Action Card */}
            <div
              className="card card-glow"
              style={{
                marginBottom: '16px',
                padding: '18px',
                background: 'linear-gradient(135deg, var(--bg-surface-soft) 0%, var(--accent-forest-soft) 100%)',
                border: '1px solid var(--border-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.15rem' }}>GROWLY Mobile APK</span>
                    <span className="badge badge-forest" style={{ fontSize: '0.7rem' }}>v1.0.0</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Android 7.0+ • Universal Build • Capacitor 8 Native Core
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '8px',
                  marginTop: '14px',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  <BellRing size={14} style={{ color: 'var(--accent-forest)', flexShrink: 0 }} />
                  <span>Exact Time Alerts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  <WifiOff size={14} style={{ color: 'var(--accent-forest)', flexShrink: 0 }} />
                  <span>100% Offline Capable</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  <Sparkles size={14} style={{ color: 'var(--accent-forest)', flexShrink: 0 }} />
                  <span>Zero Lag Native UI</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '12px 18px', fontSize: '0.95rem', fontWeight: '700' }}
                  onClick={handleDownloadApk}
                >
                  <Download size={18} />
                  {isDownloading ? 'Starting Download...' : 'Download Android APK'}
                </button>

                <button
                  className="btn btn-outline"
                  style={{ padding: '10px 14px' }}
                  onClick={handleCopyLink}
                  title="Copy direct APK URL"
                >
                  {copied ? <CheckCircle2 size={16} style={{ color: 'var(--accent-forest)' }} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  className="btn btn-outline"
                  style={{ padding: '10px 14px' }}
                  onClick={handleShare}
                  title="Share download link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Desktop Scan Section with QR Code */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <QrCodeView value={apkDownloadUrl} size={110} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <QrCode size={16} style={{ color: 'var(--accent-forest)' }} /> Scan from Phone to Download
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                  Viewing on desktop or laptop? Open your phone camera, scan the QR code, and download the APK directly onto your Android device.
                </p>
              </div>
            </div>

            {/* Quick 4-Step Walkthrough */}
            <div className="card" style={{ padding: '14px 16px', background: 'var(--bg-surface-soft)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick 4-Step Installation:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-forest" style={{ width: '20px', height: '20px', padding: 0, justifyContent: 'center' }}>1</span>
                  <span>Tap <strong>Download Android APK</strong> above.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-forest" style={{ width: '20px', height: '20px', padding: 0, justifyContent: 'center' }}>2</span>
                  <span>Open the downloaded <code>GROWLY.apk</code> file in your Downloads.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-forest" style={{ width: '20px', height: '20px', padding: 0, justifyContent: 'center' }}>3</span>
                  <span>If prompted, tap <strong>Settings</strong> & toggle <strong>Allow from this source</strong>.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-forest" style={{ width: '20px', height: '20px', padding: 0, justifyContent: 'center' }}>4</span>
                  <span>Tap <strong>Install</strong> & allow notifications for habit alarms!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Web App (PWA) */}
        {activeTab === 'pwa' && (
          <div>
            <div className="card" style={{ padding: '18px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent-blue-soft)',
                    color: 'var(--accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0 }}>Progressive Web App (PWA)</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Instant access without downloading files • Works on iOS & Android
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
                If you prefer not to install APK files, GROWLY is fully configured as a Progressive Web App. You can install it directly to your home screen right from your browser.
              </p>

              {isStandalone ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--accent-forest-soft)', borderRadius: 'var(--radius-md)', color: 'var(--accent-forest)', fontSize: '0.85rem', fontWeight: '600' }}>
                  <CheckCircle2 size={18} /> GROWLY is already running in standalone app mode!
                </div>
              ) : isInstallable ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '11px', fontWeight: '700' }}
                  onClick={promptInstall}
                >
                  <Smartphone size={16} /> Install Web App to Home Screen
                </button>
              ) : (
                <div style={{ background: 'var(--bg-surface-soft)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>How to install via Browser:</div>
                  <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                    <li><strong>Google Chrome (Android):</strong> Tap the <strong>⋮</strong> menu at top right & select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</li>
                    <li><strong>Safari (iPhone / iPad):</strong> Tap the <strong>Share</strong> button at bottom & select <strong>"Add to Home Screen"</strong>.</li>
                    <li><strong>Desktop (Chrome/Edge):</strong> Look for the install icon in the URL address bar.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '10px' }}>
                Native APK vs Browser Web App:
              </div>
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Exact background alarm notifications</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-forest)' }}>Native APK Only</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Works 100% offline</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-forest)' }}>Both (APK & PWA)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Direct home screen launcher icon</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-forest)' }}>Both (APK & PWA)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>No file download required</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>Web App (PWA)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Guide & Developer Settings */}
        {activeTab === 'guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-forest)' }} /> Android "Install Unknown Apps" Security Notice
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '10px' }}>
                Because this APK is downloaded directly from your web server rather than the Google Play Store, Android will display a security warning. This is standard Android behavior for developer and direct-distribution APKs.
              </p>
              <div style={{ background: 'var(--accent-amber-soft)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-amber)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                <strong>Tip:</strong> GROWLY contains no ads, trackers, or dangerous permissions. It only requests notification permission so habit reminders trigger on time.
              </div>
            </div>

            <div className="card" style={{ padding: '16px', background: 'var(--bg-surface-soft)' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={15} style={{ color: 'var(--accent-blue)' }} /> Developer / Host Configuration
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                To host your compiled APK on a CDN, GitHub Releases, or Supabase Storage, customize your download link below:
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="https://.../GROWLY.apk"
                  defaultValue={customApkUrl}
                  id="custom-apk-input"
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const val = document.getElementById('custom-apk-input')?.value?.trim();
                    if (val) {
                      localStorage.setItem('growly_custom_apk_url', val);
                      alert('Custom APK download URL saved!');
                    } else {
                      localStorage.removeItem('growly_custom_apk_url');
                      alert('Reverted to default server APK location (/downloads/GROWLY.apk)');
                    }
                  }}
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

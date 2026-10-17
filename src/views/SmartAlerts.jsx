import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Globe,
  RotateCcw,
  Volume2,
  Moon,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { useHabits } from '../context/HabitContext';
import { scheduleHabitReminder } from '../services/notifications/notificationManager';

export default function SmartAlerts({ onEditHabit }) {
  const {
    isNative,
    platformName,
    permissionStatus,
    requestPermission,
    quietHours,
    updateQuietHours,
    snoozeMinutes,
    updateSnoozeMinutes,
    pendingAlerts,
    refreshPending
  } = useAlerts();

  const { habits, updateHabit } = useHabits();

  const [testAlertState, setTestAlertState] = useState({ loading: false, success: false, msg: '' });

  // Filter habits that have alerts configured
  const alertHabits = habits.filter(h => h.reminderTime);

  // Toggle habit alert directly
  const handleToggleHabitAlert = async (habit) => {
    await updateHabit(habit.id, { reminderEnabled: !habit.reminderEnabled });
    await refreshPending();
  };

  // Test 10-second alert
  const handleScheduleTestAlert = async () => {
    setTestAlertState({ loading: true, success: false, msg: '' });

    if (permissionStatus !== 'granted') {
      const res = await requestPermission();
      if (!res.granted) {
        setTestAlertState({
          loading: false,
          success: false,
          msg: 'Permission denied. Please grant notification permission first.'
        });
        return;
      }
    }

    // Schedule 10 seconds from now
    const now = new Date();
    const testDate = new Date(now.getTime() + 10 * 1000);
    const timeStr = `${String(testDate.getHours()).padStart(2, '0')}:${String(testDate.getMinutes()).padStart(2, '0')}`;

    const res = await scheduleHabitReminder({
      id: 'test-diagnostic-alert',
      title: 'GROWLY Alert Test 🌿',
      message: 'Native time alert verified! Snooze and quick complete are functional.',
      time: timeStr,
      repeatType: 'daily'
    });

    if (res.scheduled) {
      setTestAlertState({
        loading: false,
        success: true,
        msg: `Test alert scheduled! It will fire at ${timeStr} (in ~10-60s depending on OS cycle).`
      });
      await refreshPending();
    } else {
      setTestAlertState({
        loading: false,
        success: false,
        msg: res.message || res.error || 'Failed to schedule alert.'
      });
    }
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.65rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={24} style={{ color: 'var(--accent-forest)' }} /> Smart Time Alerts
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Exact, reliable time-based alerts engineered for Android with snooze and quiet hours.
        </p>
      </div>

      {/* Platform & Permission Status Card */}
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${permissionStatus === 'granted' ? 'var(--accent-forest)' : 'var(--accent-terracotta)'}`,
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: permissionStatus === 'granted' ? 'var(--accent-forest-soft)' : 'var(--accent-terracotta-soft)',
                color: permissionStatus === 'granted' ? 'var(--accent-forest)' : 'var(--accent-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isNative ? <Smartphone size={22} /> : <Globe size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                  {isNative ? `Native Android Platform (${platformName})` : 'Web Browser Environment'}
                </span>
                <span className={`badge ${permissionStatus === 'granted' ? 'badge-forest' : 'badge-terracotta'}`}>
                  {permissionStatus === 'granted' ? 'Permission Active' : 'Permission Required'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isNative
                  ? 'High-importance Android notification channel registered with exact Doze-mode alarms.'
                  : 'Running in browser. For 100% background alarms when the screen is locked, install the Android APK.'}
              </p>
            </div>
          </div>

          {permissionStatus !== 'granted' && (
            <button className="btn btn-primary btn-sm" onClick={requestPermission}>
              Grant Permission
            </button>
          )}
        </div>
      </div>

      {/* Diagnostic & Quick Test Alert Button */}
      <div className="card card-flat" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Real Device Alert Verification</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Triggers a live scheduled alert to verify background audio, vibration, and snooze buttons.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleScheduleTestAlert}
            disabled={testAlertState.loading}
          >
            <Clock size={14} /> Schedule Test Alert (10s)
          </button>
        </div>

        {testAlertState.msg && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              background: testAlertState.success ? 'var(--accent-forest-soft)' : 'var(--accent-terracotta-soft)',
              color: testAlertState.success ? 'var(--accent-forest)' : 'var(--accent-terracotta)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {testAlertState.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            <span>{testAlertState.msg}</span>
          </div>
        )}
      </div>

      {/* Quiet Hours & Snooze Settings */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Moon size={18} style={{ color: 'var(--accent-forest)' }} /> Quiet Hours & Snooze Rules
        </h3>

        {/* Quiet Hours Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <span style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              Enable Quiet Hours
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Mutes habit reminders during your deep sleep window.
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={(e) => updateQuietHours({ ...quietHours, enabled: e.target.checked })}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Quiet Hours Time Range */}
        {quietHours.enabled && (
          <div style={{ display: 'flex', gap: '16px', paddingTop: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Quiet Starts (Sleep)
              </label>
              <input
                type="time"
                className="form-input"
                value={quietHours.start}
                onChange={(e) => updateQuietHours({ ...quietHours, start: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Quiet Ends (Wake)
              </label>
              <input
                type="time"
                className="form-input"
                value={quietHours.end}
                onChange={(e) => updateQuietHours({ ...quietHours, end: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Default Snooze Interval */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px' }}>
          <div>
            <span style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              Default Snooze Duration
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              When you postpone an alert, it will sound again after this period.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[5, 10, 15].map(mins => (
              <button
                key={mins}
                onClick={() => updateSnoozeMinutes(mins)}
                className={`badge ${snoozeMinutes === mins ? 'badge-forest' : 'badge-neutral'}`}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  border: snoozeMinutes === mins ? '1px solid var(--accent-forest)' : '1px solid transparent',
                  fontSize: '0.8rem'
                }}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scheduled Habit Reminders List */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>Configured Habit Reminders</h3>

        {alertHabits.length === 0 ? (
          <div className="card empty-state">
            <BellOff size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p style={{ fontSize: '0.85rem' }}>No reminders currently configured on habits.</p>
          </div>
        ) : (
          alertHabits.map(habit => (
            <div
              key={habit.id}
              className="card"
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: habit.reminderEnabled ? 'var(--accent-forest-soft)' : 'var(--bg-surface-soft)',
                    color: habit.reminderEnabled ? 'var(--accent-forest)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {habit.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    ⏰ <strong>{habit.reminderTime}</strong> • {habit.repeatSchedule === 'daily' ? 'Daily' : habit.repeatSchedule === 'weekdays' ? 'Mon-Fri' : 'Weekends'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={habit.reminderEnabled}
                    onChange={() => handleToggleHabitAlert(habit)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEditHabit(habit)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Android Battery Optimization & OEM Troubleshooting Guide */}
      <div className="card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--border-medium)' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={16} style={{ color: 'var(--accent-forest)' }} /> Android Reliability & Battery Guidelines
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
          Android device manufacturers (such as Samsung, Xiaomi, and OnePlus) employ aggressive battery optimization that may suppress background alarms when your device sleeps.
        </p>
        <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Go to <strong>Settings → Apps → GROWLY → Battery</strong> and select <strong>Unrestricted</strong>.</li>
          <li>Ensure <strong>Allow Alarms and Reminders</strong> is turned ON in system app settings.</li>
          <li>For Xiaomi/MIUI devices, enable <strong>Autostart</strong> in app permissions.</li>
        </ul>
      </div>
    </div>
  );
}

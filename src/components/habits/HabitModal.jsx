import React, { useState } from 'react';
import { X, Bell, Clock, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { useAlerts } from '../../context/AlertContext';

const CATEGORIES = [
  { id: 'morning', label: 'Morning Light & Wake' },
  { id: 'nutrition', label: 'Nutrition & Healthy Gain' },
  { id: 'fitness', label: 'Movement & Form' },
  { id: 'sleep', label: 'Sleep & Recovery' },
  { id: 'mindset', label: 'Calm & Mindset' }
];

const REPEAT_OPTIONS = [
  { id: 'daily', label: 'Every Day' },
  { id: 'weekdays', label: 'Weekdays (Mon-Fri)' },
  { id: 'weekends', label: 'Weekends (Sat-Sun)' }
];

export default function HabitModal({ habit = null, onClose }) {
  const { addHabit, updateHabit, deleteHabit } = useHabits();
  const { requestPermission, permissionStatus, isNative } = useAlerts();

  const isEditing = Boolean(habit?.id);

  const [title, setTitle] = useState(habit?.title || '');
  const [category, setCategory] = useState(habit?.category || 'nutrition');
  const [minAction, setMinAction] = useState(habit?.minAction || '');
  const [normalAction, setNormalAction] = useState(habit?.normalAction || '');
  const [extraAction, setExtraAction] = useState(habit?.extraAction || '');

  // Reminder settings
  const [reminderEnabled, setReminderEnabled] = useState(habit ? habit.reminderEnabled : true);
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || '08:00');
  const [repeatSchedule, setRepeatSchedule] = useState(habit?.repeatSchedule || 'daily');
  const [reminderMessage, setReminderMessage] = useState(
    habit?.reminderMessage || 'Take a moment for your gentle growth routine 🌿'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a habit title.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    // If reminder enabled, check/request permission
    if (reminderEnabled && permissionStatus !== 'granted') {
      const permRes = await requestPermission();
      if (!permRes.granted) {
        // still save habit, but notify user
        console.warn('Reminder enabled but notification permission not granted.');
      }
    }

    const payload = {
      title: title.trim(),
      category,
      minAction: minAction.trim() || `Small step: 1 minute of ${title.trim()}`,
      normalAction: normalAction.trim() || title.trim(),
      extraAction: extraAction.trim() || `Bonus stretch: extended ${title.trim()}`,
      reminderEnabled,
      reminderTime,
      repeatSchedule,
      reminderMessage: reminderMessage.trim()
    };

    try {
      if (isEditing) {
        await updateHabit(habit.id, payload);
      } else {
        await addHabit(payload);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save habit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${habit.title}" and cancel its scheduled alerts?`)) {
      await deleteHabit(habit.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3>{isEditing ? 'Edit Habit & Alert' : 'Create New Habit'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '8px 12px', background: 'var(--accent-danger-soft)', color: 'var(--accent-danger)', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Habit Title */}
          <div className="form-group">
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Morning Protein Shake, 10m Stretches"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Minimum Day System Configuration */}
          <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.92rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: 'var(--accent-forest)' }} /> The Minimum Day Setup
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Break your habit into 3 easy tiers so you can stay consistent even on exhausting days.
            </p>

            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--accent-forest)' }}>
                🌱 Minimum Day (When tired or overwhelmed)
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                placeholder="e.g. 1 handful of almonds or 1 glass of water"
                value={minAction}
                onChange={(e) => setMinAction(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                🌿 Normal Day (Your regular routine)
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                placeholder="e.g. 500ml protein smoothie + 1 banana"
                value={normalAction}
                onChange={(e) => setNormalAction(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
                ✨ Extra Day (When energy is high)
              </label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.88rem', padding: '8px 12px' }}
                placeholder="e.g. Meal prep 3 snack jars for the week"
                value={extraAction}
                onChange={(e) => setExtraAction(e.target.value)}
              />
            </div>
          </div>

          {/* Smart Time Alerts Configuration */}
          <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={16} style={{ color: 'var(--accent-forest)' }} />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Smart Time Alert</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {reminderEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Exact Alert Time
                    </label>
                    <input
                      type="time"
                      className="form-input"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Repeat Schedule
                    </label>
                    <select
                      className="form-select"
                      value={repeatSchedule}
                      onChange={(e) => setRepeatSchedule(e.target.value)}
                    >
                      {REPEAT_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Gentle Notification Text
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    placeholder="e.g. Time for your afternoon nourishment 🥑"
                  />
                </div>

                {!isNative && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ℹ️ In web mode, reminders notify during active browser sessions. For background wake-up notifications when your phone is locked, use the Android build.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '20px' }}>
            {isEditing ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-danger)' }}
                onClick={handleDelete}
              >
                <Trash2 size={16} /> Delete
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Scheduling...' : isEditing ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

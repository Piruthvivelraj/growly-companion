import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  Calendar,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Bell,
  HeartHandshake
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { useAlerts } from '../context/AlertContext';
import HabitCard from '../components/habits/HabitCard';
import VirtualPlant from '../components/plant/VirtualPlant';

export default function Dashboard({ onOpenAddHabit, onEditHabit, onOpenComeback, onOpenPlantDetails }) {
  const { habits, todayRecords, todayStr, plantState, reflections, saveDailyReflection } = useHabits();
  const { snooze, pendingAlerts } = useAlerts();

  // Mood reflection state
  const existingReflection = reflections[todayStr];
  const [mood, setMood] = useState(existingReflection?.mood || '');
  const [reflectionNote, setReflectionNote] = useState(existingReflection?.note || '');
  const [showReflectionSaved, setShowReflectionSaved] = useState(false);

  // Calculate today's stats
  const totalHabits = habits.length;
  const completedCount = habits.filter(h => todayRecords[h.id]?.completed).length;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Find next upcoming alert for today
  const upcomingAlertHabit = habits
    .filter(h => h.reminderEnabled && h.reminderTime && !todayRecords[h.id]?.completed)
    .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime))[0];

  // Friendly greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSaveReflection = (selectedMood) => {
    setMood(selectedMood);
    saveDailyReflection(todayStr, { mood: selectedMood, note: reflectionNote });
    setShowReflectionSaved(true);
    setTimeout(() => setShowReflectionSaved(false), 2500);
  };

  const handleNoteBlur = () => {
    if (mood || reflectionNote.trim()) {
      saveDailyReflection(todayStr, { mood: mood || 'peaceful', note: reflectionNote });
    }
  };

  // Formatted date string (e.g. Saturday, October 17)
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="content-wrapper">
      {/* Top Welcome & Date Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {formattedDate}
          </span>
          <h1 style={{ fontSize: '1.65rem', marginTop: '2px' }}>
            {getGreeting()} 🌿
          </h1>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenAddHabit}
          style={{ boxShadow: 'var(--shadow-subtle)' }}
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Grid: Virtual Plant & Daily Progress Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {/* Virtual Plant Companion Card */}
        <div onClick={onOpenPlantDetails} style={{ cursor: 'pointer' }}>
          <VirtualPlant xp={plantState.xp} name={plantState.name} />
        </div>

        {/* Daily Consistency Overview Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Today’s Gentle Progress
              </span>
              <span className="badge badge-forest">
                {completedCount} of {totalHabits} completed
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: '800', color: 'var(--accent-forest)' }}>
                {progressPercent}%
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                done without rush
              </span>
            </div>

            <div className="progress-container" style={{ height: '12px', marginBottom: '16px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Remember: choosing a <strong>Minimum Day</strong> gives you 100% completion credit. Consistency is about showing up gently, not exhausting yourself.
            </p>
          </div>

          {/* Gentle Comeback Trigger */}
          <div
            onClick={onOpenComeback}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: 'var(--bg-surface-soft)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              marginTop: '14px',
              border: '1px dashed var(--border-medium)'
            }}
          >
            <HeartHandshake size={18} style={{ color: 'var(--accent-terracotta)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Feeling tired or missed yesterday?
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Tap here for gentle recovery (+25 XP)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Scheduled Alert Banner (if any) */}
      {upcomingAlertHabit && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(90deg, var(--accent-forest-soft), var(--bg-card))',
            borderColor: 'var(--border-medium)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--accent-forest)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-forest)', textTransform: 'uppercase' }}>
                Next Smart Alert • {upcomingAlertHabit.reminderTime}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {upcomingAlertHabit.title}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => snooze(upcomingAlertHabit, 10)}
            >
              ⏰ Snooze 10m
            </button>
          </div>
        </div>
      )}

      {/* Today's Habits List */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Today's Planned Habits</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            One-tap completion
          </span>
        </div>

        {habits.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-box">
              <Sparkles size={28} />
            </div>
            <h3 style={{ marginBottom: '6px' }}>No habits added yet</h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '360px', marginBottom: '16px' }}>
              Add your first small action or nutrition routine with tailored Minimum Day levels.
            </p>
            <button className="btn btn-primary" onClick={onOpenAddHabit}>
              <Plus size={16} /> Add Your First Habit
            </button>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEditHabit}
            />
          ))
        )}
      </div>

      {/* Daily Reflection & Mindset Check-in */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-forest)' }} /> How was your energy today?
          </h3>
          {showReflectionSaved && (
            <span className="badge badge-forest" style={{ animation: 'fadeIn 200ms ease' }}>
              <CheckCircle2 size={12} /> Saved (+15 XP)
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          A gentle moment to notice how you feel without self-criticism.
        </p>

        {/* Mood Emojis */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'great', label: 'Energized', icon: '☀️' },
            { id: 'peaceful', label: 'Balanced', icon: '🌿' },
            { id: 'tired', label: 'Low Energy', icon: '🛋️' },
            { id: 'overwhelmed', label: 'Stretched Thin', icon: '🌧️' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => handleSaveReflection(m.id)}
              style={{
                flex: 1,
                minWidth: '70px',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                border: mood === m.id ? '2px solid var(--accent-forest)' : '1px solid var(--border-medium)',
                background: mood === m.id ? 'var(--accent-forest-soft)' : 'var(--bg-surface-soft)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {/* Reflection Note */}
        <input
          type="text"
          className="form-input"
          placeholder="Optional: One small win or note about your day..."
          value={reflectionNote}
          onChange={(e) => setReflectionNote(e.target.value)}
          onBlur={handleNoteBlur}
          style={{ fontSize: '0.88rem' }}
        />
      </div>
    </div>
  );
}

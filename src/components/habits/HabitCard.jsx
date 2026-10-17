import React, { useState } from 'react';
import {
  Check,
  Clock,
  MoreVertical,
  Bell,
  BellOff,
  CornerDownRight,
  Sparkles,
  Leaf,
  Sun,
  Utensils,
  Activity,
  Moon,
  Heart
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { useAlerts } from '../../context/AlertContext';

const CATEGORY_ICONS = {
  morning: Sun,
  nutrition: Utensils,
  fitness: Activity,
  sleep: Moon,
  mindset: Heart
};

export default function HabitCard({ habit, onEdit }) {
  const { todayRecords, toggleHabitCompletion, setHabitDayLevel, skipHabit } = useHabits();
  const { snooze } = useAlerts();

  const [showMenu, setShowMenu] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(habit.targetLevel || 'normal');

  const todayStatus = todayRecords[habit.id];
  const isCompleted = Boolean(todayStatus?.completed);
  const isSkipped = Boolean(todayStatus?.skipped);
  const activeLevel = todayStatus?.level || selectedLevel;

  const IconComponent = CATEGORY_ICONS[habit.category] || Leaf;

  const handleLevelSelect = (level, e) => {
    e.stopPropagation();
    setSelectedLevel(level);
    if (isCompleted) {
      setHabitDayLevel(habit.id, level);
    }
  };

  const handleToggle = () => {
    toggleHabitCompletion(habit.id, selectedLevel);
  };

  const handleSnooze = (mins = 10) => {
    snooze(habit, mins);
    setShowMenu(false);
  };

  const handleSkip = () => {
    skipHabit(habit.id, 'rest');
    setShowMenu(false);
  };

  // Get current action text based on active level
  const currentActionText = () => {
    if (activeLevel === 'minimum') return habit.minAction || habit.normalAction;
    if (activeLevel === 'extra') return habit.extraAction || habit.normalAction;
    return habit.normalAction || habit.title;
  };

  return (
    <div
      className={`card ${isCompleted ? 'card-glow' : ''}`}
      style={{
        marginBottom: '12px',
        opacity: isSkipped ? 0.6 : 1,
        borderColor: isCompleted ? 'var(--accent-forest)' : 'var(--border-light)',
        transition: 'all 250ms ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Completion Tap Button */}
        <button
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: isCompleted ? 'none' : '2px solid var(--border-strong)',
            backgroundColor: isCompleted ? 'var(--accent-forest)' : 'var(--bg-surface-soft)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '2px',
            transition: 'all var(--transition-bounce)'
          }}
        >
          {isCompleted ? <Check size={20} strokeWidth={3} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'transparent' }} />}
        </button>

        {/* Content Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--accent-forest)',
                  background: 'var(--accent-forest-soft)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}
              >
                <IconComponent size={12} /> {habit.category}
              </span>

              {habit.reminderEnabled && habit.reminderTime && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} /> {habit.reminderTime}
                </span>
              )}

              {isSkipped && (
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  Resting today
                </span>
              )}
            </div>

            {/* Overflow Options Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowMenu(prev => !prev)}
                style={{ width: '32px', height: '32px' }}
                aria-label="Habit options"
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: '0',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-float)',
                    zIndex: 60,
                    width: '180px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                    onClick={() => {
                      setShowMenu(false);
                      onEdit && onEdit(habit);
                    }}
                  >
                    Edit Habit & Alert
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                    onClick={() => handleSnooze(15)}
                  >
                    ⏰ Snooze 15 min
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--accent-terracotta)' }}
                    onClick={handleSkip}
                  >
                    🌱 Skip with Zero Guilt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Habit Title */}
          <h4
            style={{
              fontSize: '1.05rem',
              marginBottom: '6px',
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)'
            }}
          >
            {habit.title}
          </h4>

          {/* Current Day Action Text (Explaining what needs to be done) */}
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-soft)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CornerDownRight size={13} style={{ flexShrink: 0, color: 'var(--accent-forest)' }} />
            <span>{currentActionText()}</span>
          </div>

          {/* The Minimum Day System Selector Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', marginRight: '2px' }}>
              Level:
            </span>
            <button
              onClick={(e) => handleLevelSelect('minimum', e)}
              className={`badge ${activeLevel === 'minimum' ? 'badge-forest' : 'badge-neutral'}`}
              style={{
                cursor: 'pointer',
                border: activeLevel === 'minimum' ? '1px solid var(--accent-forest)' : '1px solid transparent',
                padding: '3px 8px'
              }}
              title="Minimum Day: A small, low-effort step when tired or busy"
            >
              🌱 Min Day (+10 XP)
            </button>
            <button
              onClick={(e) => handleLevelSelect('normal', e)}
              className={`badge ${activeLevel === 'normal' ? 'badge-forest' : 'badge-neutral'}`}
              style={{
                cursor: 'pointer',
                border: activeLevel === 'normal' ? '1px solid var(--accent-forest)' : '1px solid transparent',
                padding: '3px 8px'
              }}
              title="Normal Day: Your regular standard routine"
            >
              🌿 Normal (+20 XP)
            </button>
            <button
              onClick={(e) => handleLevelSelect('extra', e)}
              className={`badge ${activeLevel === 'extra' ? 'badge-forest' : 'badge-neutral'}`}
              style={{
                cursor: 'pointer',
                border: activeLevel === 'extra' ? '1px solid var(--accent-forest)' : '1px solid transparent',
                padding: '3px 8px'
              }}
              title="Extra Day: An optional stretch when energy is high"
            >
              ✨ Extra (+30 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

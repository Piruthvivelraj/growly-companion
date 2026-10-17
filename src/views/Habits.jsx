import React, { useState } from 'react';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Sun,
  Utensils,
  Activity,
  Moon,
  Heart,
  ChevronRight,
  Bell,
  BellOff
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/habits/HabitCard';

const FILTERS = [
  { id: 'all', label: 'All Habits' },
  { id: 'morning', label: 'Morning' },
  { id: 'nutrition', label: 'Nutrition & Gain' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'mindset', label: 'Mindset' },
];

export default function Habits({ onOpenAddHabit, onEditHabit }) {
  const { habits, updateHabit } = useHabits();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredHabits = habits.filter(h => {
    if (selectedFilter === 'all') return true;
    return h.category === selectedFilter;
  });

  const toggleHabitReminderOnly = async (e, habit) => {
    e.stopPropagation();
    await updateHabit(habit.id, { reminderEnabled: !habit.reminderEnabled });
  };

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem' }}>Habits & Routines</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Each habit features 3 levels (Min, Normal, Extra) and custom time alerts.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenAddHabit}>
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Category Pills Filter */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'none'
        }}
      >
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              border: selectedFilter === f.id ? '1px solid var(--accent-forest)' : '1px solid var(--border-medium)',
              background: selectedFilter === f.id ? 'var(--accent-forest)' : 'var(--bg-surface)',
              color: selectedFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Habit Cards */}
      {filteredHabits.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon-box">
            <Sparkles size={28} />
          </div>
          <h3 style={{ marginBottom: '6px' }}>No habits found</h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '340px', marginBottom: '16px' }}>
            {selectedFilter === 'all'
              ? 'Create your first gentle habit to start filling your daily companion.'
              : `No habits categorized under "${selectedFilter}".`}
          </p>
          <button className="btn btn-primary" onClick={onOpenAddHabit}>
            <Plus size={16} /> Create Habit
          </button>
        </div>
      ) : (
        filteredHabits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={onEditHabit}
          />
        ))
      )}
    </div>
  );
}

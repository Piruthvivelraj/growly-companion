import React from 'react';
import {
  TrendingUp,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Heart
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useHabits } from '../context/HabitContext';

export default function Progress() {
  const { habits, completions, plantState, todayStr } = useHabits();

  // Compute 7-day completion rate data for the chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayRecords = completions[dateStr] || {};
    const totalHabits = habits.length || 1;
    const completedCount = Object.values(dayRecords).filter(r => r.completed).length;
    const rate = Math.round((completedCount / totalHabits) * 100);

    last7Days.push({
      date: dayLabel,
      completed: completedCount,
      rate: rate
    });
  }

  // Generate 14-day consistency grid
  const past14Days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayNumber = d.getDate();
    const isToday = dateStr === todayStr;

    const dayRecords = completions[dateStr] || {};
    const count = Object.values(dayRecords).filter(r => r.completed).length;

    past14Days.push({
      dateStr,
      dayNumber,
      isToday,
      count
    });
  }

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.65rem' }}>Progress & Milestones</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Celebrating gentle consistency, adaptability, and personal growth.
        </p>
      </div>

      {/* 7-Day Completion Rate Chart */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Recorded Data
            </span>
            <h3 style={{ fontSize: '1.15rem', marginTop: '2px' }}>7-Day Habit Consistency</h3>
          </div>
          <span className="badge badge-forest">
            <TrendingUp size={13} /> Active Trend
          </span>
        </div>

        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val}%`, 'Completion Rate']}
              />
              <Bar dataKey="rate" fill="var(--accent-forest)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 14-Day Calendar Consistency Grid */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <CalendarIcon size={18} style={{ color: 'var(--accent-forest)' }} />
          <h3 style={{ fontSize: '1.1rem' }}>14-Day Gentle Activity Map</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {past14Days.map((item, idx) => {
            const hasActivity = item.count > 0;
            return (
              <div
                key={idx}
                style={{
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-sm)',
                  background: hasActivity ? 'var(--accent-forest-soft)' : 'var(--bg-surface-soft)',
                  border: item.isToday ? '2px solid var(--accent-forest)' : '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: item.isToday ? '800' : '500' }}>
                  {item.dayNumber}
                </span>
                {hasActivity ? (
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--accent-forest)' }}>
                    {item.count} ✓
                  </span>
                ) : (
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-medium)' }} />
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
          Every dot represents actions completed (Minimum, Normal, or Extra days all count!).
        </p>
      </div>

      {/* Personal Milestones Journal */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Award size={18} style={{ color: 'var(--accent-amber)' }} />
          <h3 style={{ fontSize: '1.1rem' }}>Growth Milestones & Awards</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {plantState.milestones.map((m, idx) => (
            <div
              key={m.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-soft)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber-soft)',
                  color: 'var(--accent-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Awarded on {m.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine Ease & Adaptability Insights */}
      <div className="card" style={{ background: 'var(--bg-surface-soft)', border: '1px solid var(--border-medium)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-forest)', textTransform: 'uppercase' }}>
          Adaptive Routine Insights (Estimated)
        </span>
        <h4 style={{ fontSize: '0.98rem', marginTop: '4px', marginBottom: '8px' }}>
          Your Consistency Patterns
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
          • Morning habits show the highest consistency rate when scheduled within 30 minutes of waking.<br />
          • Nutrition habits completed at the <strong>Minimum Day</strong> level successfully prevent the "all-or-nothing" cycle on demanding days.
        </p>
      </div>
    </div>
  );
}

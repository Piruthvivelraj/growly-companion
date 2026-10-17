import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Scale,
  TrendingUp,
  Heart,
  Moon,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useHabits } from '../context/HabitContext';

const MEAL_IDEAS = [
  { title: 'Gentle Calorie Smoothie', desc: 'Whole milk/oat milk, 1 banana, 2 tbsp peanut butter, oats, honey (~550 kcal)', tag: 'Snack / Fuel' },
  { title: 'Nutrient-Dense Trail Mix', desc: 'Walnuts, almonds, dried cranberries, dark chocolate chips (~400 kcal)', tag: 'Desk Fuel' },
  { title: 'Greek Yogurt & Flax Cup', desc: 'Full-fat yogurt, chia/flax seeds, berries, drizzle of olive oil or honey (~350 kcal)', tag: 'Recovery' },
  { title: 'Avocado & Egg Sourdough', desc: 'Toasted whole grain sourdough, mashed avocado, poached eggs & olive oil (~480 kcal)', tag: 'Breakfast' }
];

export default function Health() {
  const { healthConfig, setHealthConfig, weightLogs, addWeightLog } = useHabits();

  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');

  // Prepare chart data (sorted by date)
  const chartData = [...weightLogs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(entry => ({
      date: entry.date.slice(5), // 'MM-DD'
      weight: entry.weight,
      note: entry.note
    }));

  const latestWeight = weightLogs.length > 0 ? weightLogs[0].weight : null;
  const initialWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;
  const weightChange = latestWeight && initialWeight ? (latestWeight - initialWeight).toFixed(1) : 0;

  const handleSaveWeight = (e) => {
    e.preventDefault();
    if (!newWeight || isNaN(newWeight)) return;
    addWeightLog(newWeight, newNote);
    setNewWeight('');
    setNewNote('');
    setShowLogModal(false);
  };

  if (!healthConfig.enabled) {
    return (
      <div className="content-wrapper">
        <div className="card empty-state">
          <Utensils size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3>Health & Nutrition Tracking is Paused</h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '380px', marginBottom: '18px' }}>
            You can use GROWLY purely as a habit tracker, or enable gentle nutrition and weight tracking anytime.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setHealthConfig({ ...healthConfig, enabled: true })}
          >
            Enable Nutrition & Health
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem' }}>Nutrition & Healthy Gain</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Nourishing your body with steady fuel, no toxic calorie obsession.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLogModal(true)}>
          <Plus size={16} /> Log Weight
        </button>
      </div>

      {/* Weight Summary & Historical Progress Chart */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-forest-soft)',
                color: 'var(--accent-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Scale size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Current Baseline
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {latestWeight ? `${latestWeight} ${healthConfig.unit}` : 'No entry yet'}
              </div>
            </div>
          </div>

          {weightChange !== 0 && (
            <span className="badge badge-forest" style={{ fontSize: '0.82rem' }}>
              <TrendingUp size={13} /> {weightChange > 0 ? `+${weightChange}` : weightChange} {healthConfig.unit} overall
            </span>
          )}
        </div>

        {/* Recharts Historical Trend Line */}
        {chartData.length > 1 ? (
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight"
                  stroke="var(--accent-forest)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--accent-forest)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Add at least two weight check-ins to view your gentle trend line.
          </div>
        )}
      </div>

      {/* Gentle Nutrition & High-Energy Snack Ideas */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} /> Gentle Nourishment Ideas
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Easy, nutrient-dense foods that support healthy weight gain without making you feel uncomfortably full.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {MEAL_IDEAS.map((meal, idx) => (
            <div key={idx} className="card card-flat" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>{meal.tag}</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{meal.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{meal.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Medical & Health Disclaimer */}
      <div
        className="card"
        style={{
          background: 'var(--bg-surface-soft)',
          borderLeft: '4px solid var(--accent-terracotta)',
          padding: '14px 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <AlertCircle size={20} style={{ color: 'var(--accent-terracotta)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Gentle Guidance Notice
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              GROWLY provides lifestyle and routine support for healthy habits. It does not provide medical diagnosis or replace personalized care from a doctor or registered dietitian. If you experience unexplained sudden weight loss, significant loss of appetite, or health concerns, please consult a medical professional.
            </p>
          </div>
        </div>
      </div>

      {/* Weight Log Modal */}
      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '14px' }}>Record Weight Check-in</h3>
            <form onSubmit={handleSaveWeight}>
              <div className="form-group">
                <label className="form-label">Weight ({healthConfig.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 65.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Optional Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. After breakfast, feeling steady energy"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Entry (+10 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

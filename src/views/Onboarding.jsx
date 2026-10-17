import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  Check,
  Bell,
  Clock,
  Sparkles,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { useAlerts } from '../context/AlertContext';

const GOALS = [
  { id: 'weight_gain', title: 'Healthy Weight Gain & Fuel', desc: 'Consistent calorie-dense snacks, nutrition routines & steady strength', icon: '🥑' },
  { id: 'consistency', title: 'Daily Consistency & Habits', desc: 'Breaking procrastination without burnout or overwhelming lists', icon: '🌱' },
  { id: 'fitness', title: 'Gentle Fitness & Mobility', desc: 'Sustainable movement that honors your joints, energy, and recovery', icon: '🌿' },
  { id: 'sleep', title: 'Restorative Sleep & Evenings', desc: 'Calming wind-down rhythms and screen-free bedtime rituals', icon: '🌙' },
  { id: 'lifestyle', title: 'Overall Mindful Lifestyle', desc: 'A peaceful, balanced routine of hydration, pauses, and nourishment', icon: '✨' },
];

const OBSTACLES = [
  { id: 'overwhelmed', label: 'Feeling overwhelmed by huge checklists', fix: 'GROWLY’s Minimum Day system keeps habits microscopic on hard days.' },
  { id: 'forgetting', label: 'Simply forgetting when life gets busy', fix: 'Smart Time Alerts notify you at exact anchor moments with snooze options.' },
  { id: 'guilt', label: 'Missing 1 day and giving up entirely', fix: 'Zero-guilt Comeback system. Your streak and plant are never destroyed.' },
  { id: 'energy', label: 'Unpredictable fatigue or low motivation', fix: 'Gentle 1-minute minimum options award full daily completion credit.' }
];

export default function Onboarding({ onComplete }) {
  const { finishOnboarding } = useHabits();
  const { requestPermission, isNative } = useAlerts();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('weight_gain');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [bedTime, setBedTime] = useState('22:30');
  const [selectedObstacle, setSelectedObstacle] = useState('overwhelmed');
  const [plantName, setPlantName] = useState('Oliver');
  const [notificationsGranted, setNotificationsGranted] = useState(false);

  // Generate starter habits tailored to goal
  const generateStarterHabits = () => {
    if (selectedGoal === 'weight_gain') {
      return [
        {
          id: `h-gain-1`,
          title: 'Morning Fuel & Water',
          category: 'nutrition',
          minAction: 'Drink 1 full glass of water + 1 banana',
          normalAction: 'Nourishing breakfast + 500ml water and nutrient shake',
          extraAction: 'Pack an extra calorie-dense snack bag for midday',
          reminderEnabled: true,
          reminderTime: wakeTime,
          repeatSchedule: 'daily',
          reminderMessage: 'Rise & hydrate: fuel your body with gentle nourishment 🥑'
        },
        {
          id: `h-gain-2`,
          title: 'Afternoon Calorie Booster',
          category: 'nutrition',
          minAction: 'Handful of mixed nuts or peanut butter toast',
          normalAction: 'High-protein, healthy-fat snack (smoothie, nuts, or yogurt)',
          extraAction: 'Log meal notes in Health tab & celebrate nutrition',
          reminderEnabled: true,
          reminderTime: '15:30',
          repeatSchedule: 'daily',
          reminderMessage: 'Afternoon energy: enjoy your healthy weight gain snack 🥜'
        },
        {
          id: `h-gain-3`,
          title: 'Mobility & Form',
          category: 'fitness',
          minAction: '3 slow spine twists & shoulder stretches',
          normalAction: '15-minute bodyweight or gentle resistance routine',
          extraAction: 'Full 30-minute strength session with rest intervals',
          reminderEnabled: true,
          reminderTime: '18:00',
          repeatSchedule: 'weekdays',
          reminderMessage: 'Light movement: stimulate appetite and muscle recovery 🌿'
        }
      ];
    }

    // Default consistency / lifestyle starter habits
    return [
      {
        id: `h-life-1`,
        title: 'Morning Sunlight & Water',
        category: 'morning',
        minAction: 'Drink 1 glass of water by a window',
        normalAction: '500ml water + 5 min morning daylight on eyes',
        extraAction: '10 min walk outdoors while deep breathing',
        reminderEnabled: true,
        reminderTime: wakeTime,
        repeatSchedule: 'daily',
        reminderMessage: 'Morning light & gentle hydration to wake your mind ☀️'
      },
      {
        id: `h-life-2`,
        title: 'Midday Mindful Pause',
        category: 'mindset',
        minAction: '3 deep belly breaths away from screen',
        normalAction: '5-minute posture reset, glass of water & fresh air',
        extraAction: '15 min mindful walk without headphones',
        reminderEnabled: true,
        reminderTime: '13:30',
        repeatSchedule: 'daily',
        reminderMessage: 'Pause and breathe: take a 2-minute restful check-in 🌿'
      },
      {
        id: `h-life-3`,
        title: 'Night Screen Dim & Rest',
        category: 'sleep',
        minAction: 'Set phone down 15m before bed',
        normalAction: 'Dim room lights, sip warm tea, read 5 pages',
        extraAction: '30 min screen-free reading & meditation',
        reminderEnabled: true,
        reminderTime: bedTime,
        repeatSchedule: 'daily',
        reminderMessage: 'Night wind-down: your body and mind deserve deep rest 🌙'
      }
    ];
  };

  const handleEnableAlerts = async () => {
    const res = await requestPermission();
    if (res.granted) {
      setNotificationsGranted(true);
    }
  };

  const handleFinish = () => {
    const starterHabits = generateStarterHabits();
    finishOnboarding({
      goal: selectedGoal,
      wakeTime,
      bedTime,
      obstacle: selectedObstacle,
      plantName,
      starterHabits
    });
    if (onComplete) onComplete();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)',
        background: 'linear-gradient(180deg, var(--bg-app), var(--bg-surface-soft))'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: 'var(--space-lg)',
          boxShadow: 'var(--shadow-float)'
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="header-brand-icon" style={{ width: '28px', height: '28px' }}>
              <Sprout size={16} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-forest)' }}>
              Step {step} of 4
            </span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-muted)' }}
            onClick={handleFinish}
          >
            Skip to App
          </button>
        </div>

        {/* STEP 1: Main Goal */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>What brings you to GROWLY?</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Choose your primary focus. You can adjust this anytime.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {GOALS.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedGoal === goal.id ? '2px solid var(--accent-forest)' : '1px solid var(--border-medium)',
                    background: selectedGoal === goal.id ? 'var(--accent-forest-soft)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {goal.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {goal.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(2)}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Daily Rhythm */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Your Natural Daily Rhythm</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We time your gentle alerts around your schedule so they never interrupt you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} style={{ color: 'var(--accent-amber)' }} /> Usual Wake-up Time
                  </span>
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} style={{ color: 'var(--accent-blue)' }} /> Usual Bedtime / Wind-down
                  </span>
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Obstacle & Plant Name */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>What usually gets in the way?</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              GROWLY is designed specifically to help you overcome consistency friction.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {OBSTACLES.map(obs => (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObstacle(obs.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedObstacle === obs.id ? '2px solid var(--accent-forest)' : '1px solid var(--border-medium)',
                    background: selectedObstacle === obs.id ? 'var(--accent-forest-soft)' : 'var(--bg-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {obs.label}
                  </div>
                  {selectedObstacle === obs.id && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-forest)', marginTop: '4px', fontWeight: '500' }}>
                      ✨ {obs.fix}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Name your virtual plant companion</label>
              <input
                type="text"
                className="form-input"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Oliver, Basil, Fern"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(4)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Smart Time Alerts & Ready */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--accent-forest-soft)',
                  color: 'var(--accent-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}
              >
                <Bell size={30} />
              </div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Enable Smart Time Alerts</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Reliable time-based reminders keep you gently on track without intrusive spam.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Device Notifications</span>
                {notificationsGranted ? (
                  <span className="badge badge-forest"><Check size={12} /> Enabled</span>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={handleEnableAlerts}>
                    Allow Notifications
                  </button>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isNative
                  ? 'Native Android notification channel with high priority and snooze support.'
                  : 'Web browser mode: Reminders notify while the app is active. Full background alarms are enabled in the Android APK.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setStep(3)}>
                <ChevronLeft size={16} /> Back
              </button>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleFinish}>
                <Sparkles size={18} /> Launch GROWLY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

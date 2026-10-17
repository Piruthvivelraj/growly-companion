import React, { useState } from 'react';
import { Heart, Sparkles, X, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

const OBSTACLES = [
  { id: 'time', label: 'Not enough time / Busy schedule', tip: 'Try setting your Minimum Day step (takes < 2 minutes).' },
  { id: 'forgot', label: 'Forgot or missed the alert', tip: 'Let’s adjust your alert time or ensure battery optimization is disabled.' },
  { id: 'energy', label: 'Low physical energy or fatigue', tip: 'Honor your recovery. Consistency means doing 1% on low days, not 100% every day.' },
  { id: 'difficult', label: 'The task felt too ambitious', tip: 'Scale down to the Minimum Day definition permanently to build momentum first.' },
  { id: 'inconvenient', label: 'The scheduled time was bad', tip: 'Shift the alert to a natural anchor in your day (e.g. right after morning coffee).' }
];

export default function ComebackModal({ onClose }) {
  const { addXP } = useHabits();
  const [selectedReason, setSelectedReason] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleResolve = () => {
    // Reward returning with +25 Comeback bonus XP
    addXP(25, 'Comeback Check-in & Compassion');
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--accent-terracotta-soft)',
                color: 'var(--accent-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Heart size={16} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Welcome Back, Friend</h3>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {!submitted ? (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Life happens, energy shifts, and schedules get crowded. At GROWLY, missing a day is just data, never failure. Your plant is safe, and your progress is intact.
            </p>

            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
              What felt like the biggest friction point? (Optional)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {OBSTACLES.map(obs => (
                <div
                  key={obs.id}
                  onClick={() => setSelectedReason(obs.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedReason === obs.id ? '2px solid var(--accent-forest)' : '1px solid var(--border-medium)',
                    background: selectedReason === obs.id ? 'var(--accent-forest-soft)' : 'var(--bg-surface-soft)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {obs.label}
                  </div>
                  {selectedReason === obs.id && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-forest)', marginTop: '4px', fontWeight: '500' }}>
                      💡 {obs.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-outline" onClick={onClose}>
                Just browsing
              </button>
              <button className="btn btn-primary" onClick={handleResolve}>
                <Sparkles size={16} /> Reset Compassionately (+25 XP)
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
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
                margin: '0 auto 16px auto'
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>You’re Back On Track!</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We added <strong>+25 XP</strong> to Oliver for showing up. Remember: a Minimum Day counts 100% towards your growth.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

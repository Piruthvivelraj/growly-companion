import React, { useState } from 'react';
import { X, Sparkles, Heart, Award, Edit2, Check } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import VirtualPlant, { PLANT_STAGES, getPlantStageInfo } from './VirtualPlant';

export default function PlantModal({ onClose }) {
  const { plantState, addXP } = useHabits();
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(plantState.name || 'Oliver');

  const currentStage = getPlantStageInfo(plantState.xp);

  const handleSaveName = () => {
    localStorage.setItem(
      'growly_plant_state',
      JSON.stringify({ ...plantState, name: name.trim() || 'Oliver' })
    );
    setEditingName(false);
  };

  const handleWaterPlant = () => {
    // Gentle interaction bonus
    addXP(5, 'Loved & Watered Oliver');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '4px 8px', fontSize: '1rem', width: '140px' }}
                  autoFocus
                />
                <button className="btn btn-primary btn-sm" onClick={handleSaveName}>
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{name}</h3>
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => setEditingName(true)}
                  aria-label="Rename plant"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            <span className="badge badge-forest">{currentStage.name}</span>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Large Virtual Plant View */}
        <VirtualPlant xp={plantState.xp} name={name} compact={false} />

        {/* Gentle Plant Interaction */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={handleWaterPlant}>
            💧 Water Oliver (+5 XP)
          </button>
        </div>

        {/* Growth Stages Map */}
        <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} style={{ color: 'var(--accent-amber)' }} /> All 5 Growth Stages
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PLANT_STAGES.map(s => {
              const isPassed = plantState.xp >= s.minXp;
              const isCurrent = currentStage.stage === s.stage;

              return (
                <div
                  key={s.stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent ? 'var(--accent-forest-soft)' : 'var(--bg-surface)',
                    border: isCurrent ? '1.5px solid var(--accent-forest)' : '1px solid var(--border-light)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: isCurrent ? 'var(--accent-forest)' : 'var(--text-primary)' }}>
                      Stage {s.stage}: {s.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      ({s.minXp}-{s.maxXp} XP)
                    </span>
                  </div>
                  {isPassed ? (
                    <span style={{ color: 'var(--accent-forest)', fontWeight: '700' }}>✓ Unlocked</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Sparkles, Trophy, Heart } from 'lucide-react';

export const PLANT_STAGES = [
  { stage: 1, name: 'Seed', minXp: 0, maxXp: 99, subtitle: 'Gently sleeping in rich soil' },
  { stage: 2, name: 'Sprout', minXp: 100, maxXp: 249, subtitle: 'First green leaves seeking sunlight' },
  { stage: 3, name: 'Young Plant', minXp: 250, maxXp: 499, subtitle: 'Forming strong roots & new branches' },
  { stage: 4, name: 'Growing Plant', minXp: 500, maxXp: 899, subtitle: 'Lush, resilient foliage blooming' },
  { stage: 5, name: 'Mature Plant', minXp: 900, maxXp: 1500, subtitle: 'Thriving companion in full vigor' },
];

export function getPlantStageInfo(xp) {
  for (let i = PLANT_STAGES.length - 1; i >= 0; i--) {
    if (xp >= PLANT_STAGES[i].minXp) {
      return {
        ...PLANT_STAGES[i],
        progressPercent: Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((xp - PLANT_STAGES[i].minXp) / (PLANT_STAGES[i].maxXp - PLANT_STAGES[i].minXp)) * 100
            )
          )
        )
      };
    }
  }
  return { ...PLANT_STAGES[0], progressPercent: 0 };
}

export default function VirtualPlant({ xp = 120, name = 'Oliver', compact = false }) {
  const currentStage = getPlantStageInfo(xp);

  // Dynamic SVG rendering based on current stage
  const renderPlantArt = () => {
    switch (currentStage.stage) {
      case 1:
        // Seed in soil
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%" className="plant-svg">
            {/* Pot */}
            <ellipse cx="80" cy="130" rx="42" ry="14" fill="#C97A5E" />
            <path d="M42 130 L48 95 L112 95 L118 130 Z" fill="#D9886C" />
            <ellipse cx="80" cy="95" rx="32" ry="9" fill="#5A3E2B" />
            {/* Soil mound */}
            <ellipse cx="80" cy="93" rx="26" ry="6" fill="#3D2817" />
            {/* Tiny golden seed */}
            <ellipse cx="80" cy="91" rx="5" ry="3.5" fill="#E5A84B" />
            <circle cx="79" cy="90" r="1.5" fill="#FFF3D6" />
          </svg>
        );
      case 2:
        // Sprout with two baby leaves
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%" className="plant-svg">
            {/* Pot */}
            <ellipse cx="80" cy="132" rx="42" ry="14" fill="#C97A5E" />
            <path d="M42 132 L48 97 L112 97 L118 132 Z" fill="#D9886C" />
            <ellipse cx="80" cy="97" rx="32" ry="9" fill="#5A3E2B" />
            {/* Stem */}
            <path d="M80 97 Q80 72 80 62" stroke="#5F8372" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Left baby leaf */}
            <path d="M80 68 C64 62 60 50 68 45 C78 40 80 60 80 68 Z" fill="#4E876A" />
            <path d="M79 66 C70 60 68 53 73 49" stroke="#8CB09F" strokeWidth="1" fill="none" />
            {/* Right baby leaf */}
            <path d="M80 64 C96 58 100 46 92 41 C82 36 80 56 80 64 Z" fill="#5AB38C" />
            <path d="M81 62 C90 56 92 49 87 45" stroke="#A8DEC2" strokeWidth="1" fill="none" />
          </svg>
        );
      case 3:
        // Young Plant with branched stems and 4 leaves
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%" className="plant-svg">
            <ellipse cx="80" cy="132" rx="44" ry="14" fill="#C97A5E" />
            <path d="M40 132 L46 97 L114 97 L120 132 Z" fill="#D9886C" />
            <ellipse cx="80" cy="97" rx="34" ry="9" fill="#5A3E2B" />
            {/* Main Stem */}
            <path d="M80 97 Q79 70 80 44" stroke="#456E58" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Lower Left Leaf */}
            <path d="M78 78 Q55 80 44 68 Q56 54 77 72" fill="#3D7559" />
            {/* Lower Right Leaf */}
            <path d="M82 72 Q105 74 116 62 Q104 48 83 66" fill="#4E876A" />
            {/* Upper Left Leaf */}
            <path d="M79 56 Q58 50 52 34 Q70 28 80 48" fill="#5AB38C" />
            {/* Top Leaf */}
            <path d="M80 45 Q74 24 80 18 Q86 24 80 45" fill="#69C99E" />
          </svg>
        );
      case 4:
        // Growing Plant with lush foliage and heart-leaf accents
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%" className="plant-svg">
            <ellipse cx="80" cy="132" rx="45" ry="14" fill="#BF7054" />
            <path d="M39 132 L45 97 L115 97 L121 132 Z" fill="#D9886C" />
            <ellipse cx="80" cy="97" rx="35" ry="9" fill="#4B3323" />
            {/* Main thick stem */}
            <path d="M80 97 Q78 68 80 38" stroke="#375D49" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Leaves */}
            <path d="M77 82 C48 90 32 72 40 56 C52 46 76 68 77 82 Z" fill="#2D5A43" />
            <path d="M83 76 C112 84 128 66 120 50 C108 40 84 62 83 76 Z" fill="#3D7559" />
            <path d="M78 60 C50 62 38 42 50 30 C64 22 78 44 78 60 Z" fill="#4E876A" />
            <path d="M82 52 C110 54 122 34 110 22 C96 14 82 36 82 52 Z" fill="#5AB38C" />
            <path d="M80 38 C70 18 80 10 80 10 C80 10 90 18 80 38 Z" fill="#71D6A7" />
          </svg>
        );
      case 5:
      default:
        // Mature Plant in full glory with golden accents
        return (
          <svg viewBox="0 0 160 160" width="100%" height="100%" className="plant-svg">
            <ellipse cx="80" cy="132" rx="46" ry="14" fill="#B36549" />
            <path d="M38 132 L44 97 L116 97 L122 132 Z" fill="#D9886C" />
            <ellipse cx="80" cy="97" rx="36" ry="9" fill="#3D2817" />
            {/* Pot decorative band */}
            <path d="M43 105 L117 105" stroke="#E5A84B" strokeWidth="2.5" />
            {/* Main Trunk & branches */}
            <path d="M80 97 Q76 65 80 32" stroke="#2B4E3C" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <path d="M79 70 Q52 64 36 48" stroke="#375D49" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M81 64 Q108 58 124 42" stroke="#375D49" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Rich Monstera-like foliage */}
            <path d="M36 48 C22 56 16 38 28 26 C42 18 56 38 36 48 Z" fill="#23533E" />
            <path d="M124 42 C138 50 144 32 132 20 C118 12 104 32 124 42 Z" fill="#2E694F" />
            <path d="M78 50 C46 44 40 22 58 12 C74 8 82 32 78 50 Z" fill="#3E8464" />
            <path d="M82 44 C114 38 120 16 102 6 C86 2 78 26 82 44 Z" fill="#52A77F" />
            <path d="M80 32 C68 12 80 2 80 2 C80 2 92 12 80 32 Z" fill="#71D6A7" />
            {/* Sparkling dew drops */}
            <circle cx="56" cy="22" r="2" fill="#D4F3FF" opacity="0.9" />
            <circle cx="106" cy="18" r="2" fill="#D4F3FF" opacity="0.9" />
          </svg>
        );
    }
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '64px', height: '64px', position: 'relative', flexShrink: 0 }}>
          {renderPlantArt()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {name} • {currentStage.name}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-forest)' }}>
              {xp} XP
            </span>
          </div>
          <div className="progress-container" style={{ height: '7px' }}>
            <div className="progress-bar-fill" style={{ width: `${currentStage.progressPercent}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-glow" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Stage Badge */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <span className="badge badge-forest">
          <Sparkles size={12} /> Stage {currentStage.stage} of 5
        </span>
      </div>

      {/* Plant Name & Subtitle */}
      <div style={{ marginTop: '4px', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {currentStage.subtitle}
        </p>
      </div>

      {/* Plant Art Illustration */}
      <div
        style={{
          width: '140px',
          height: '140px',
          margin: '0 auto 12px auto',
          position: 'relative',
          filter: 'drop-shadow(0 8px 18px rgba(35, 83, 62, 0.12))'
        }}
      >
        {renderPlantArt()}
      </div>

      {/* Progress Bar & XP indicator */}
      <div style={{ maxWidth: '320px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Stage: {currentStage.name}</span>
          <span style={{ color: 'var(--accent-forest)', fontWeight: '700' }}>
            {xp} / {currentStage.maxXp} XP
          </span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-fill" style={{ width: `${currentStage.progressPercent}%` }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          🌱 Every small act feeds Oliver. Missing a day will never harm your plant!
        </p>
      </div>
    </div>
  );
}

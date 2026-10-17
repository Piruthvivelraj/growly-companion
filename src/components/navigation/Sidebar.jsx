import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  UtensilsCrossed,
  TrendingUp,
  Settings,
  Plus,
  Sprout
} from 'lucide-react';
import VirtualPlant from '../plant/VirtualPlant';
import { useHabits } from '../../context/HabitContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Today’s Focus', icon: LayoutDashboard },
  { id: 'habits', label: 'Habits & Min Days', icon: CheckSquare },
  { id: 'alerts', label: 'Smart Time Alerts', icon: Bell },
  { id: 'health', label: 'Nutrition & Gain', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress & Insights', icon: TrendingUp },
  { id: 'settings', label: 'Settings & Cloud', icon: Settings },
];

export default function Sidebar({ activeTab, onSelectTab, onOpenAddHabit, onOpenPlantDetails, onOpenDownloadModal }) {
  const { plantState } = useHabits();

  return (
    <aside className="app-sidebar">
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
        <div className="header-brand-icon">
          <Sprout size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>GROWLY</h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Growth Companion</span>
        </div>
      </div>

      {/* Quick Add Habit CTA */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', marginBottom: '24px', padding: '10px 16px', fontSize: '0.9rem' }}
        onClick={onOpenAddHabit}
      >
        <Plus size={16} /> New Habit
      </button>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--accent-forest-soft)' : 'transparent',
                color: isActive ? 'var(--accent-forest)' : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--accent-forest)' : 'var(--text-muted)' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile App Download Card */}
      <div
        onClick={onOpenDownloadModal}
        style={{
          marginTop: 'auto',
          marginBottom: '10px',
          padding: '10px 12px',
          background: 'linear-gradient(135deg, var(--accent-forest-soft) 0%, var(--bg-surface-soft) 100%)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all var(--transition-fast)'
        }}
        title="Download Android APK or Install Web App"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-forest)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}
          >
            APK
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>Get Mobile App</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Android APK & PWA</div>
          </div>
        </div>
      </div>

      {/* Virtual Plant Miniature in Sidebar */}
      <div
        onClick={onOpenPlantDetails}
        style={{
          padding: '12px',
          background: 'var(--bg-surface-soft)',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          border: '1px solid var(--border-light)',
          transition: 'border-color var(--transition-fast)'
        }}
      >
        <VirtualPlant xp={plantState.xp} name={plantState.name} compact={true} />
      </div>
    </aside>
  );
}

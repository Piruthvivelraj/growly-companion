import React from 'react';
import { LayoutDashboard, CheckSquare, Bell, UtensilsCrossed, TrendingUp, Settings } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const BOTTOM_ITEMS = [
  { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
  { id: 'habits', label: 'Habits', icon: CheckSquare },
  { id: 'alerts', label: 'Alerts', icon: Bell, hasBadge: true },
  { id: 'health', label: 'Health', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function BottomNav({ activeTab, onSelectTab }) {
  const { permissionStatus } = useAlerts();

  return (
    <nav className="bottom-nav">
      {BOTTOM_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const showAlertDot = item.hasBadge && permissionStatus !== 'granted';

        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-label={item.label}
          >
            <div className="icon-wrapper">
              <Icon size={19} />
              {showAlertDot && <span className="nav-badge" />}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

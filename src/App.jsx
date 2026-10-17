import React, { useState } from 'react';
import { useHabits } from './context/HabitContext';
import Header from './components/navigation/Header';
import Sidebar from './components/navigation/Sidebar';
import BottomNav from './components/navigation/BottomNav';
import Dashboard from './views/Dashboard';
import Habits from './views/Habits';
import SmartAlerts from './views/SmartAlerts';
import Health from './views/Health';
import Progress from './views/Progress';
import Settings from './views/Settings';
import Onboarding from './views/Onboarding';
import HabitModal from './components/habits/HabitModal';
import ComebackModal from './components/comeback/ComebackModal';
import PlantModal from './components/plant/PlantModal';
import SqlSchemaModal from './components/common/SqlSchemaModal';
import DownloadAppModal from './components/download/DownloadAppModal';

export default function App() {
  const { onboardingCompleted } = useHabits();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingHabit, setEditingHabit] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showComeback, setShowComeback] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // If user hasn't completed onboarding, show guided flow
  if (!onboardingCompleted) {
    return <Onboarding onComplete={() => setActiveTab('dashboard')} />;
  }

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowAddHabit(true);
  };

  const handleCloseHabitModal = () => {
    setShowAddHabit(false);
    setEditingHabit(null);
  };

  return (
    <div className="app-container">
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddHabit={() => {
          setEditingHabit(null);
          setShowAddHabit(true);
        }}
        onOpenPlantDetails={() => setShowPlantModal(true)}
        onOpenDownloadModal={() => setShowDownloadModal(true)}
      />

      {/* Main Content Area */}
      <main className="app-main">
        {/* Top Header with theme toggle, demo badge & comeback trigger */}
        <Header
          onOpenComeback={() => setShowComeback(true)}
          onOpenPlantDetails={() => setShowPlantModal(true)}
          onOpenDownloadModal={() => setShowDownloadModal(true)}
        />

        {/* Dynamic Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            onOpenAddHabit={() => {
              setEditingHabit(null);
              setShowAddHabit(true);
            }}
            onEditHabit={handleEditHabit}
            onOpenComeback={() => setShowComeback(true)}
            onOpenPlantDetails={() => setShowPlantModal(true)}
          />
        )}

        {activeTab === 'habits' && (
          <Habits
            onOpenAddHabit={() => {
              setEditingHabit(null);
              setShowAddHabit(true);
            }}
            onEditHabit={handleEditHabit}
          />
        )}

        {activeTab === 'alerts' && (
          <SmartAlerts
            onEditHabit={handleEditHabit}
          />
        )}

        {activeTab === 'health' && (
          <Health />
        )}

        {activeTab === 'progress' && (
          <Progress />
        )}

        {activeTab === 'settings' && (
          <Settings
            onOpenSqlModal={() => setShowSqlModal(true)}
            onOpenDownloadModal={() => setShowDownloadModal(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Habit Create / Edit Modal */}
      {showAddHabit && (
        <HabitModal
          habit={editingHabit}
          onClose={handleCloseHabitModal}
        />
      )}

      {/* Comeback Zero-Penalty Recovery Modal */}
      {showComeback && (
        <ComebackModal
          onClose={() => setShowComeback(false)}
        />
      )}

      {/* Virtual Plant Deep-Dive Modal */}
      {showPlantModal && (
        <PlantModal
          onClose={() => setShowPlantModal(false)}
        />
      )}

      {/* Supabase SQL Migration Modal */}
      {showSqlModal && (
        <SqlSchemaModal
          onClose={() => setShowSqlModal(false)}
        />
      )}

      {/* Download Mobile App (APK & PWA) Modal */}
      {showDownloadModal && (
        <DownloadAppModal
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  );
}

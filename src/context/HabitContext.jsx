import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAlerts } from './AlertContext';

const HabitContext = createContext();

// Default starter habits for new users (grounding, gentle, consistency-focused)
const DEFAULT_HABITS = [
  {
    id: 'habit-1',
    title: 'Morning Sunlight & Water',
    category: 'morning',
    icon: 'Sun',
    targetLevel: 'normal', // 'minimum' | 'normal' | 'extra'
    minAction: 'Drink 1 glass of water near a window (1 min)',
    normalAction: 'Drink 500ml water and step outside for 5 min of morning light',
    extraAction: '10 min walk outside while hydrating and taking deep breaths',
    reminderEnabled: true,
    reminderTime: '07:30',
    repeatSchedule: 'daily',
    reminderMessage: 'Rise gently: reach for water and morning sunlight ☀️',
    createdAt: new Date().toISOString()
  },
  {
    id: 'habit-2',
    title: 'Nourishing Snack or Shake',
    category: 'nutrition',
    icon: 'Utensils',
    targetLevel: 'normal',
    minAction: 'A handful of almonds or 1 banana (easy energy)',
    normalAction: 'Smoothie or nutrient-dense snack with protein and healthy fats',
    extraAction: 'Prep tomorrow’s calorie-dense snack box in advance',
    reminderEnabled: true,
    reminderTime: '15:30',
    repeatSchedule: 'daily',
    reminderMessage: 'Gentle fuel: have your nourishing afternoon snack 🥑',
    createdAt: new Date().toISOString()
  },
  {
    id: 'habit-3',
    title: 'Movement & Mobility',
    category: 'fitness',
    icon: 'Activity',
    targetLevel: 'normal',
    minAction: '3 gentle neck and shoulder rolls in your chair',
    normalAction: '15-minute bodyweight routine or purposeful walk',
    extraAction: '30-minute strength session with focused form',
    reminderEnabled: true,
    reminderTime: '18:00',
    repeatSchedule: 'weekdays',
    reminderMessage: 'Honor your body: time for light movement and release 🌿',
    createdAt: new Date().toISOString()
  },
  {
    id: 'habit-4',
    title: 'Wind-Down & Screen Dim',
    category: 'sleep',
    icon: 'Moon',
    targetLevel: 'normal',
    minAction: 'Put phone face down 15 min before sleep',
    normalAction: 'Dim lights, sip herbal tea, and read 5 pages of a book',
    extraAction: '30 min screen-free meditation, journaling, and dim bedroom',
    reminderEnabled: true,
    reminderTime: '21:45',
    repeatSchedule: 'daily',
    reminderMessage: 'Night wind-down: dim your lights and rest your mind 🌙',
    createdAt: new Date().toISOString()
  }
];

export function HabitProvider({ children }) {
  const { scheduleReminder, removeReminder } = useAlerts();

  // Core Habits List
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('growly_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  // Daily Completion Logs { "YYYY-MM-DD": { [habitId]: { completed: boolean, level: 'min'|'normal'|'extra', completedAt: string, skipped: boolean } } }
  const [completions, setCompletions] = useState(() => {
    const saved = localStorage.getItem('growly_completions');
    return saved ? JSON.parse(saved) : {};
  });

  // Plant XP & Stats
  const [plantState, setPlantState] = useState(() => {
    const saved = localStorage.getItem('growly_plant_state');
    return saved ? JSON.parse(saved) : {
      xp: 140, // starts at Sprout level to give initial encouragement
      name: 'Oliver',
      plantType: 'Monstera Deliciosa',
      milestones: [
        { id: 'm1', title: 'First Seed Planted', date: new Date().toISOString().split('T')[0] }
      ]
    };
  });

  // Daily Reflection Logs { "YYYY-MM-DD": { mood: 'great'|'calm'|'tired'|'overwhelmed', note: string } }
  const [reflections, setReflections] = useState(() => {
    const saved = localStorage.getItem('growly_reflections');
    return saved ? JSON.parse(saved) : {};
  });

  // Health Tracking Data (optional)
  const [healthConfig, setHealthConfig] = useState(() => {
    const saved = localStorage.getItem('growly_health_config');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      trackWeight: true,
      trackMeals: true,
      unit: 'kg'
    };
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    const saved = localStorage.getItem('growly_weight_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'w1', date: '2026-10-10', weight: 64.2, note: 'Baseline entry' },
      { id: 'w2', date: '2026-10-14', weight: 64.6, note: 'Feeling stronger' },
      { id: 'w3', date: '2026-10-17', weight: 64.9, note: 'Consistent breakfast' }
    ];
  });

  // Onboarding status
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem('growly_onboarding_done') === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('growly_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('growly_completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem('growly_plant_state', JSON.stringify(plantState));
  }, [plantState]);

  useEffect(() => {
    localStorage.setItem('growly_reflections', JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem('growly_health_config', JSON.stringify(healthConfig));
  }, [healthConfig]);

  useEffect(() => {
    localStorage.setItem('growly_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Today's completion records
  const todayRecords = completions[todayStr] || {};

  // Add XP and advance plant
  const addXP = (points, milestoneTitle = null) => {
    setPlantState(prev => {
      const newXP = Math.max(0, prev.xp + points);
      let updatedMilestones = [...prev.milestones];
      if (milestoneTitle) {
        updatedMilestones.push({
          id: `m_${Date.now()}`,
          title: milestoneTitle,
          date: todayStr
        });
      }
      return {
        ...prev,
        xp: newXP,
        milestones: updatedMilestones
      };
    });
  };

  // Toggle habit completion (One-Tap Action)
  const toggleHabitCompletion = (habitId, level = 'normal') => {
    const existing = todayRecords[habitId];
    const isCompleted = existing?.completed;

    const newRecords = { ...todayRecords };

    if (isCompleted) {
      // Un-complete
      delete newRecords[habitId];
      // subtract proportional XP
      const deduction = existing.level === 'minimum' ? 10 : existing.level === 'extra' ? 30 : 20;
      addXP(-deduction);
    } else {
      // Mark as completed
      newRecords[habitId] = {
        completed: true,
        level,
        completedAt: new Date().toISOString(),
        skipped: false
      };
      // Award XP based on chosen level
      const points = level === 'minimum' ? 10 : level === 'extra' ? 30 : 20;
      addXP(points);
    }

    setCompletions(prev => ({
      ...prev,
      [todayStr]: newRecords
    }));
  };

  // Set habit difficulty level for today (Minimum Day toggle)
  const setHabitDayLevel = (habitId, level) => {
    const existing = todayRecords[habitId];
    if (existing && existing.completed) {
      // update level and adjust XP difference
      const oldPts = existing.level === 'minimum' ? 10 : existing.level === 'extra' ? 30 : 20;
      const newPts = level === 'minimum' ? 10 : level === 'extra' ? 30 : 20;
      addXP(newPts - oldPts);

      setCompletions(prev => ({
        ...prev,
        [todayStr]: {
          ...todayRecords,
          [habitId]: { ...existing, level }
        }
      }));
    }
  };

  // Skip a habit gently without penalty
  const skipHabit = (habitId, reason = 'busy') => {
    setCompletions(prev => ({
      ...prev,
      [todayStr]: {
        ...todayRecords,
        [habitId]: {
          completed: false,
          skipped: true,
          skipReason: reason,
          skippedAt: new Date().toISOString()
        }
      }
    }));
  };

  // Create Habit
  const addHabit = async (habitData) => {
    const newHabit = {
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      targetLevel: 'normal',
      repeatSchedule: 'daily',
      reminderEnabled: true,
      ...habitData
    };

    setHabits(prev => [...prev, newHabit]);

    if (newHabit.reminderEnabled && newHabit.reminderTime) {
      await scheduleReminder(newHabit);
    }
    return newHabit;
  };

  // Update Habit
  const updateHabit = async (habitId, updates) => {
    let updatedObj = null;
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          updatedObj = { ...h, ...updates };
          return updatedObj;
        }
        return h;
      })
    );

    if (updatedObj) {
      if (updatedObj.reminderEnabled && updatedObj.reminderTime) {
        await scheduleReminder(updatedObj);
      } else {
        await removeReminder(habitId);
      }
    }
  };

  // Delete Habit
  const deleteHabit = async (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    await removeReminder(habitId);
  };

  // Record Daily Reflection
  const saveDailyReflection = (date, { mood, note }) => {
    setReflections(prev => ({
      ...prev,
      [date]: { mood, note, savedAt: new Date().toISOString() }
    }));
    addXP(15, 'Logged Daily Reflection');
  };

  // Record Weight Log
  const addWeightLog = (weight, note = '') => {
    const newEntry = {
      id: `w-${Date.now()}`,
      date: todayStr,
      weight: parseFloat(weight),
      note
    };
    setWeightLogs(prev => [newEntry, ...prev]);
    addXP(10);
    return newEntry;
  };

  // Complete Onboarding & optionally initialize custom starter habits
  const finishOnboarding = (onboardingData) => {
    if (onboardingData?.starterHabits && onboardingData.starterHabits.length > 0) {
      setHabits(onboardingData.starterHabits);
      // schedule alerts for all enabled habits
      onboardingData.starterHabits.forEach(h => {
        if (h.reminderEnabled && h.reminderTime) {
          scheduleReminder(h);
        }
      });
    }
    setOnboardingCompleted(true);
    localStorage.setItem('growly_onboarding_done', 'true');
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        todayRecords,
        todayStr,
        plantState,
        reflections,
        healthConfig,
        weightLogs,
        onboardingCompleted,
        toggleHabitCompletion,
        setHabitDayLevel,
        skipHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        addXP,
        saveDailyReflection,
        setHealthConfig,
        addWeightLog,
        finishOnboarding
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within a HabitProvider');
  return context;
}

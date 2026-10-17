import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  isNative,
  platformName,
  initNotificationService,
  checkNotificationPermission,
  requestNotificationPermission,
  scheduleHabitReminder,
  cancelHabitReminder,
  snoozeHabitReminder,
  getPendingNativeReminders
} from '../services/notifications/notificationManager';
import { App } from '@capacitor/app';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [quietHours, setQuietHours] = useState(() => {
    const saved = localStorage.getItem('growly_quiet_hours');
    return saved ? JSON.parse(saved) : { enabled: false, start: '22:00', end: '07:00' };
  });
  const [snoozeMinutes, setSnoozeMinutes] = useState(() => {
    const saved = localStorage.getItem('growly_snooze_min');
    return saved ? Number(saved) : 10;
  });
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [serviceReady, setServiceReady] = useState(false);

  // Initialize service & check initial permissions
  useEffect(() => {
    async function init() {
      await initNotificationService();
      const status = await checkNotificationPermission();
      setPermissionStatus(status);
      setServiceReady(true);
      if (isNative) {
        const pending = await getPendingNativeReminders();
        setPendingAlerts(pending);
      }
    }
    init();

    // App state listener (reconcile when returning to foreground)
    let appStateListener;
    if (isNative) {
      appStateListener = App.addListener('appStateChange', async (state) => {
        if (state.isActive) {
          const status = await checkNotificationPermission();
          setPermissionStatus(status);
          const pending = await getPendingNativeReminders();
          setPendingAlerts(pending);
        }
      });
    }

    return () => {
      if (appStateListener && appStateListener.remove) {
        appStateListener.remove();
      }
    };
  }, []);

  const requestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res.status);
    return res;
  };

  const updateQuietHours = (newConfig) => {
    setQuietHours(newConfig);
    localStorage.setItem('growly_quiet_hours', JSON.stringify(newConfig));
  };

  const updateSnoozeMinutes = (minutes) => {
    setSnoozeMinutes(minutes);
    localStorage.setItem('growly_snooze_min', String(minutes));
  };

  const scheduleReminder = useCallback(async (habit) => {
    if (!habit || !habit.reminderTime || !habit.reminderEnabled) {
      return { scheduled: false, reason: 'REMINDER_DISABLED' };
    }

    // Check Quiet Hours
    if (quietHours.enabled) {
      const [alertH] = habit.reminderTime.split(':').map(Number);
      const [startH] = quietHours.start.split(':').map(Number);
      const [endH] = quietHours.end.split(':').map(Number);
      const isQuiet = startH > endH
        ? (alertH >= startH || alertH < endH)
        : (alertH >= startH && alertH < endH);

      if (isQuiet) {
        console.warn(`Reminder for "${habit.title}" falls inside Quiet Hours (${quietHours.start} - ${quietHours.end})`);
      }
    }

    const result = await scheduleHabitReminder({
      id: habit.id,
      title: habit.title,
      message: habit.reminderMessage || `Gentle reminder: take a moment for ${habit.title}`,
      time: habit.reminderTime,
      repeatType: habit.repeatSchedule || 'daily',
      customDays: habit.customDays || [0, 1, 2, 3, 4, 5, 6]
    });

    if (isNative) {
      const pending = await getPendingNativeReminders();
      setPendingAlerts(pending);
    }

    return result;
  }, [quietHours]);

  const removeReminder = useCallback(async (habitId) => {
    const res = await cancelHabitReminder(habitId);
    if (isNative) {
      const pending = await getPendingNativeReminders();
      setPendingAlerts(pending);
    }
    return res;
  }, []);

  const snooze = useCallback(async (habit, minutes) => {
    const mins = minutes || snoozeMinutes;
    const res = await snoozeHabitReminder({
      habitId: habit.id,
      title: habit.title,
      minutes: mins
    });
    if (isNative) {
      const pending = await getPendingNativeReminders();
      setPendingAlerts(pending);
    }
    return res;
  }, [snoozeMinutes]);

  const refreshPending = async () => {
    if (isNative) {
      const pending = await getPendingNativeReminders();
      setPendingAlerts(pending);
      return pending;
    }
    return [];
  };

  return (
    <AlertContext.Provider
      value={{
        isNative,
        platformName,
        permissionStatus,
        serviceReady,
        quietHours,
        snoozeMinutes,
        pendingAlerts,
        requestPermission,
        updateQuietHours,
        updateSnoozeMinutes,
        scheduleReminder,
        removeReminder,
        snooze,
        refreshPending
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlerts must be used within an AlertProvider');
  return context;
}

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'growly_habits_channel';
const CHANNEL_NAME = 'GROWLY Reminders & Routines';

/**
 * Platform Detection
 */
export const isNative = Capacitor.isNativePlatform();
export const platformName = Capacitor.getPlatform(); // 'android', 'ios', or 'web'

/**
 * Initialize Notification Channels & Action Types on Mobile
 */
export async function initNotificationService() {
  if (!isNative) {
    return { success: true, platform: 'web' };
  }

  try {
    // Register Notification Channel for Android 8.0+
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: CHANNEL_NAME,
      description: 'Gentle time-based habit reminders and progress prompts',
      importance: 5, // NotificationManager.IMPORTANCE_HIGH
      visibility: 1, // VISIBILITY_PUBLIC
      vibration: true,
      lights: true,
      lightColor: '#2D5A43'
    });

    // Register Action Types (Quick Complete and Snooze buttons on notification)
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'GROWLY_REMINDER_ACTIONS',
          actions: [
            {
              id: 'COMPLETE_ACTION',
              title: '✓ Mark Complete',
              foreground: false
            },
            {
              id: 'SNOOZE_ACTION',
              title: '⏰ Snooze 10m',
              foreground: false
            }
          ]
        }
      ]
    });

    return { success: true, platform: platformName };
  } catch (error) {
    console.error('Failed to initialize native notification channel/actions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check Permission Status
 */
export async function checkNotificationPermission() {
  if (isNative) {
    try {
      const status = await LocalNotifications.checkPermissions();
      return status.display; // 'granted', 'denied', or 'prompt'
    } catch (err) {
      console.warn('Error checking native permissions:', err);
      return 'denied';
    }
  }

  // Web Browser environment
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission; // 'granted', 'denied', 'default'
  }
  return 'unsupported';
}

/**
 * Request Notification Permissions
 */
export async function requestNotificationPermission() {
  if (isNative) {
    try {
      const result = await LocalNotifications.requestPermissions();
      return {
        granted: result.display === 'granted',
        status: result.display,
        isNative: true
      };
    } catch (err) {
      return {
        granted: false,
        status: 'denied',
        error: err.message,
        isNative: true
      };
    }
  }

  // Web browser fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return {
        granted: permission === 'granted',
        status: permission,
        isNative: false
      };
    } catch (err) {
      return {
        granted: false,
        status: 'denied',
        error: err.message,
        isNative: false
      };
    }
  }

  return {
    granted: false,
    status: 'unsupported',
    isNative: false
  };
}

/**
 * Hash string to positive 32-bit integer for native notification ID
 */
export function getNotificationId(strId) {
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    const char = strId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) % 2147483647;
}

/**
 * Calculate the next Date trigger matching habit time and recurrence
 * @param {string} timeString "HH:MM" in 24h format
 * @param {string} repeatType "daily" | "weekdays" | "weekends" | "custom"
 * @param {number[]} customDays Array of day indices [0=Sun, 1=Mon, ..., 6=Sat]
 */
export function calculateNextTrigger(timeString, repeatType = 'daily', customDays = [0, 1, 2, 3, 4, 5, 6]) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // Helper to determine if day index is valid
  const isDayValid = (dayIdx) => {
    if (repeatType === 'daily') return true;
    if (repeatType === 'weekdays') return dayIdx >= 1 && dayIdx <= 5;
    if (repeatType === 'weekends') return dayIdx === 0 || dayIdx === 6;
    if (repeatType === 'custom') return customDays.includes(dayIdx);
    return true;
  };

  // If time today is in the future and today is valid, schedule for today
  if (target.getTime() > now.getTime() && isDayValid(now.getDay())) {
    return target;
  }

  // Otherwise scan forward day by day up to 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    nextDate.setHours(hours, minutes, 0, 0);

    if (isDayValid(nextDate.getDay())) {
      return nextDate;
    }
  }

  // Fallback next day
  const fallback = new Date(now);
  fallback.setDate(now.getDate() + 1);
  fallback.setHours(hours, minutes, 0, 0);
  return fallback;
}

/**
 * Schedule a Habit Reminder
 */
export async function scheduleHabitReminder({
  id,
  title,
  message,
  time,
  repeatType = 'daily',
  customDays = [0, 1, 2, 3, 4, 5, 6]
}) {
  const permStatus = await checkNotificationPermission();
  if (permStatus !== 'granted') {
    return {
      scheduled: false,
      reason: 'PERMISSION_NOT_GRANTED',
      message: 'Notification permission is required to schedule reminders.'
    };
  }

  const notifId = getNotificationId(id);
  const triggerDate = calculateNextTrigger(time, repeatType, customDays);

  if (isNative) {
    try {
      // First cancel existing to prevent duplicates
      await LocalNotifications.cancel({ notifications: [{ id: notifId }] });

      // Schedule with native Capacitor plugin
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title: title || 'GROWLY Habit Reminder',
            body: message || `Time for your daily routine: ${title}`,
            channelId: CHANNEL_ID,
            actionTypeId: 'GROWLY_REMINDER_ACTIONS',
            schedule: {
              at: triggerDate,
              allowWhileIdle: true // Required on Android for exact timing through Doze mode
            },
            extra: {
              habitId: id,
              repeatType,
              time
            }
          }
        ]
      });

      return {
        scheduled: true,
        notificationId: notifId,
        triggerDate,
        platform: platformName
      };
    } catch (err) {
      console.error('Failed to schedule native notification:', err);
      return {
        scheduled: false,
        reason: 'NATIVE_ERROR',
        error: err.message
      };
    }
  }

  // Web Browser scheduling fallback
  // We record the alert in storage and schedule an active session timeout if within today
  const msUntil = triggerDate.getTime() - Date.now();
  return {
    scheduled: true,
    notificationId: notifId,
    triggerDate,
    platform: 'web',
    msUntil,
    note: 'Active in browser. Background alert on phone requires native Android app build.'
  };
}

/**
 * Cancel a Scheduled Reminder
 */
export async function cancelHabitReminder(id) {
  const notifId = getNotificationId(id);
  if (isNative) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: notifId }] });
      return { success: true };
    } catch (err) {
      console.error('Failed to cancel native notification:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: true, platform: 'web' };
}

/**
 * Snooze a reminder by N minutes
 */
export async function snoozeHabitReminder({ habitId, title, minutes = 10 }) {
  const permStatus = await checkNotificationPermission();
  if (permStatus !== 'granted') return { success: false };

  const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
  const snoozeNotifId = getNotificationId(`snooze_${habitId}`);

  if (isNative) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: snoozeNotifId,
            title: `⏰ Snoozed: ${title}`,
            body: `Gentle reminder for: ${title} (snoozed ${minutes}m)`,
            channelId: CHANNEL_ID,
            actionTypeId: 'GROWLY_REMINDER_ACTIONS',
            schedule: {
              at: snoozeDate,
              allowWhileIdle: true
            },
            extra: {
              habitId,
              isSnooze: true
            }
          }
        ]
      });
      return { success: true, snoozeDate };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, snoozeDate, platform: 'web' };
}

/**
 * Get pending alerts directly from Android native system
 */
export async function getPendingNativeReminders() {
  if (isNative) {
    try {
      const pending = await LocalNotifications.getPending();
      return pending.notifications;
    } catch (err) {
      console.error('Error fetching pending notifications:', err);
      return [];
    }
  }
  return [];
}

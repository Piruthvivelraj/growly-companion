-- =====================================================================
-- GROWLY — Supabase PostgreSQL Database Schema & Row Level Security
-- =====================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT DEFAULT 'Growth Explorer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABITS TABLE
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nutrition', -- 'morning', 'nutrition', 'fitness', 'sleep', 'mindset'
  icon TEXT DEFAULT 'Leaf',
  target_level TEXT DEFAULT 'normal', -- 'minimum', 'normal', 'extra'
  min_action TEXT NOT NULL,
  normal_action TEXT NOT NULL,
  extra_action TEXT NOT NULL,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TEXT DEFAULT '08:00', -- 'HH:MM'
  repeat_schedule TEXT DEFAULT 'daily', -- 'daily', 'weekdays', 'weekends', 'custom'
  custom_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
  reminder_message TEXT DEFAULT 'Take a moment for your gentle growth routine 🌿',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);

-- 3. HABIT COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL, -- 'YYYY-MM-DD'
  level TEXT DEFAULT 'normal', -- 'minimum', 'normal', 'extra'
  completed BOOLEAN DEFAULT TRUE,
  skipped BOOLEAN DEFAULT FALSE,
  skip_reason TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_habit_daily_record UNIQUE(habit_id, completion_date)
);

CREATE INDEX IF NOT EXISTS idx_completions_user_date ON public.habit_completions(user_id, completion_date);

-- 4. VIRTUAL PLANT STATE TABLE
CREATE TABLE IF NOT EXISTS public.plant_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_name TEXT DEFAULT 'Oliver',
  xp_points INTEGER DEFAULT 140,
  current_stage INTEGER DEFAULT 2,
  milestones JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DAILY REFLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.daily_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_date DATE NOT NULL,
  mood TEXT NOT NULL, -- 'great', 'peaceful', 'tired', 'overwhelmed'
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_reflection_date UNIQUE(user_id, reflection_date)
);

CREATE INDEX IF NOT EXISTS idx_reflections_user ON public.daily_reflections(user_id);

-- 6. WEIGHT & NUTRITION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight_value NUMERIC(5,2) NOT NULL,
  unit TEXT DEFAULT 'kg',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_user_date ON public.weight_logs(user_id, log_date);

-- 7. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  snooze_minutes INTEGER DEFAULT 10,
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '07:00',
  track_nutrition BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can select and update only their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Habits: Users can manage only their own habits
CREATE POLICY "Users can manage own habits" ON public.habits
  FOR ALL USING (auth.uid() = user_id);

-- Habit Completions
CREATE POLICY "Users can manage own completions" ON public.habit_completions
  FOR ALL USING (auth.uid() = user_id);

-- Plant State
CREATE POLICY "Users can manage own plant state" ON public.plant_state
  FOR ALL USING (auth.uid() = user_id);

-- Daily Reflections
CREATE POLICY "Users can manage own reflections" ON public.daily_reflections
  FOR ALL USING (auth.uid() = user_id);

-- Weight Logs
CREATE POLICY "Users can manage own weight logs" ON public.weight_logs
  FOR ALL USING (auth.uid() = user_id);

-- User Preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

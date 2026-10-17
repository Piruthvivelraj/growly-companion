import React, { useState } from 'react';
import { X, Copy, Check, Database } from 'lucide-react';

const SQL_CONTENT = `-- GROWLY Supabase SQL Schema
-- Copy and paste this directly into your Supabase Dashboard SQL Editor:

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nutrition',
  min_action TEXT NOT NULL,
  normal_action TEXT NOT NULL,
  extra_action TEXT NOT NULL,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TEXT DEFAULT '08:00',
  repeat_schedule TEXT DEFAULT 'daily',
  reminder_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON public.habits
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  level TEXT DEFAULT 'normal',
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_habit_daily UNIQUE(habit_id, completion_date)
);

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own completions" ON public.habit_completions
  FOR ALL USING (auth.uid() = user_id);
`;

export default function SqlSchemaModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} style={{ color: 'var(--accent-forest)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Supabase SQL Migration</h3>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          To sync across multiple devices, paste this schema into your Supabase project's SQL editor. Row Level Security is automatically enabled.
        </p>

        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <pre
            style={{
              background: 'var(--bg-input)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              overflowX: 'auto',
              maxHeight: '260px',
              color: 'var(--text-primary)',
              fontFamily: 'monospace'
            }}
          >
            {SQL_CONTENT}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}
          </button>
        </div>
      </div>
    </div>
  );
}

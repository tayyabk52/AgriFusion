-- Add new columns for enhanced notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS action_url text,
  ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS category character varying,
  ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Add check constraint for priority column (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notifications_priority_check'
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_priority_check
      CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_category
  ON public.notifications (category);

CREATE INDEX IF NOT EXISTS idx_notifications_priority
  ON public.notifications (priority);

CREATE INDEX IF NOT EXISTS idx_notifications_expires
  ON public.notifications (expires_at)
  WHERE expires_at IS NOT NULL;

-- Function to auto-delete expired notifications
CREATE OR REPLACE FUNCTION delete_expired_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_expired_notifications() TO authenticated;

-- Optional comment for documentation
COMMENT ON FUNCTION delete_expired_notifications() IS 'Deletes notifications that have passed their expiration date. Can be scheduled via cron job.';

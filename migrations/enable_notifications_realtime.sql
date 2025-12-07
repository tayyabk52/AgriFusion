-- Enable Realtime for notifications table

-- 1. Set REPLICA IDENTITY to FULL (required for realtime DELETE events)
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- 2. Enable Row Level Security (already enabled, but ensuring it)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Add the notifications table to the realtime publication
-- This allows Supabase Realtime to broadcast changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Verify the setup
-- SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

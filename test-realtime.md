# Testing Realtime Notifications

## Step 1: Run the Database Migration

Execute this SQL in your Supabase SQL Editor:

```sql
-- Enable Realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

## Step 2: Verify Realtime is Enabled

Run this query in Supabase SQL Editor:

```sql
SELECT tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename = 'notifications';
```

You should see `notifications` in the results.

## Step 3: Test in Browser

1. Open your dashboard in the browser
2. Open Developer Console (F12)
3. Look for these console messages:
   - ✅ `Real-time notifications connected`
   - 🔔 `New notification received:` (when notification arrives)

## Step 4: Create a Test Notification

Open another browser tab with Supabase SQL Editor and run:

```sql
-- Get your profile ID first
SELECT id, full_name, role FROM profiles WHERE email = 'your-email@example.com';

-- Insert a test notification (replace YOUR_PROFILE_ID)
INSERT INTO notifications (recipient_id, type, category, priority, title, message)
VALUES (
  'YOUR_PROFILE_ID',
  'system',
  'system',
  'high',
  'Test Notification',
  'This is a test notification to verify realtime updates are working!'
);
```

You should see:
- Console log: `🔔 New notification received:`
- Bell badge updates immediately
- Notification appears in dropdown

## Troubleshooting

### If you see "CHANNEL_ERROR" or "TIMED_OUT":

1. **Check Supabase Dashboard**:
   - Go to Database → Replication
   - Ensure `supabase_realtime` publication exists
   - Ensure `notifications` table is in the publication

2. **Check RLS Policies**:
   - Users must have SELECT permission on notifications table
   - Run: `SELECT * FROM notifications WHERE recipient_id = 'YOUR_ID'`
   - If this works, RLS is fine

3. **Check Network**:
   - Open Network tab in DevTools
   - Filter by "WS" (WebSocket)
   - You should see a WebSocket connection to Supabase

### If notifications still don't appear:

1. **Hard refresh** the page (Ctrl+Shift+R / Cmd+Shift+R)
2. **Clear cache** and restart the dev server
3. **Check Profile Context** is being used:
   - Console should show: `✅ Real-time notifications connected`
   - If not, the ProfileProvider might not be wrapping the component

## Expected Console Logs (Working):

```
✅ Real-time notifications connected
🔔 New notification received: {id: "...", title: "Test Notification", ...}
```

## Expected Console Logs (Not Working):

```
❌ Real-time notifications connection error
⏱️ Real-time notifications connection timed out
```

If you see errors, check the database migration was applied correctly.

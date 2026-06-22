-- Add reminder_sent column to events table for tracking if reminder email has been sent
ALTER TABLE events ADD COLUMN reminder_sent BOOLEAN DEFAULT false;

CREATE INDEX idx_events_reminder_sent ON events(reminder_sent) WHERE reminder_sent = false;

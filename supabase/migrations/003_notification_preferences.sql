-- Notification Preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_welcome BOOLEAN DEFAULT true,
  email_membership_confirmation BOOLEAN DEFAULT true,
  email_membership_renewal_reminder BOOLEAN DEFAULT true,
  email_event_registration_confirmation BOOLEAN DEFAULT true,
  email_event_reminder BOOLEAN DEFAULT true,
  email_pd_credits_earned BOOLEAN DEFAULT true,
  email_team_invite BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_preferences
CREATE POLICY notification_preferences_select ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = user_id AND org_id IN (
      SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin'
    )
  ));

CREATE POLICY notification_preferences_update ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY notification_preferences_insert ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

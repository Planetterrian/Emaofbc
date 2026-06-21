-- ============================================================================
-- RLS Policies for organizations table
-- ============================================================================

-- Public: anyone can see active organizations
CREATE POLICY "public_read_active_orgs" ON organizations
  FOR SELECT
  USING (status = 'active' OR auth.role() = 'authenticated');

-- Employee: can see own org
CREATE POLICY "employee_read_own_org" ON organizations
  FOR SELECT
  USING (
    id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Org Admin: can read/update own org
CREATE POLICY "org_admin_read_own_org" ON organizations
  FOR SELECT
  USING (
    id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  );

CREATE POLICY "org_admin_update_own_org" ON organizations
  FOR UPDATE
  USING (
    id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  )
  WITH CHECK (
    id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_orgs" ON organizations
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for users table
-- ============================================================================

-- Employee: can see own profile
CREATE POLICY "employee_read_own_profile" ON users
  FOR SELECT
  USING (
    id = auth.uid()
  );

-- Employee: can see other employees in own org
CREATE POLICY "employee_read_org_roster" ON users
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
    AND org_id IS NOT NULL
  );

-- Org Admin: can see own org users
CREATE POLICY "org_admin_read_org_users" ON users
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  );

-- Org Admin: can update own org users (except role changes)
CREATE POLICY "org_admin_update_org_users" ON users
  FOR UPDATE
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  )
  WITH CHECK (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
    AND role = (SELECT role FROM users WHERE id = auth.uid())  -- cannot change their own role
  );

-- Board: read-mostly, no PII editing
CREATE POLICY "board_read_minimal" ON users
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'board'
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_users" ON users
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for memberships table
-- ============================================================================

-- Employee: can see own org's membership
CREATE POLICY "employee_read_membership" ON memberships
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Org Admin: can manage own org's memberships
CREATE POLICY "org_admin_manage_membership" ON memberships
  FOR ALL
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  );

-- Board: read-only
CREATE POLICY "board_read_memberships" ON memberships
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'board'
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_memberships" ON memberships
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for events table
-- ============================================================================

-- Public: can see published events
CREATE POLICY "public_read_published_events" ON events
  FOR SELECT
  USING (status IN ('published', 'full', 'past'));

-- Authenticated: can see draft events they're linked to (for admin)
CREATE POLICY "ed_admin_all_events" ON events
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for registrations table
-- ============================================================================

-- Employee: can see own registrations
CREATE POLICY "employee_read_own_registrations" ON registrations
  FOR SELECT
  USING (
    user_id = auth.uid()
  );

-- Employee: can create registrations for self
CREATE POLICY "employee_create_registration" ON registrations
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
  );

-- Org Admin: can see org's registrations
CREATE POLICY "org_admin_read_registrations" ON registrations
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin')
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_registrations" ON registrations
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for pd_credits table
-- ============================================================================

-- Employee: can see own credits
CREATE POLICY "employee_read_own_credits" ON pd_credits
  FOR SELECT
  USING (
    user_id = auth.uid()
  );

-- Org Admin: can see org members' credits
CREATE POLICY "org_admin_read_credits" ON pd_credits
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE org_id = (
        SELECT org_id FROM users WHERE id = auth.uid() AND role = 'org_admin'
      )
    )
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_credits" ON pd_credits
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for awards table
-- ============================================================================

-- Employee: can see submissions from own org
CREATE POLICY "employee_read_org_awards" ON awards
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Board: can see all awards for review
CREATE POLICY "board_read_awards" ON awards
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'board'
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_awards" ON awards
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for sponsorships table
-- ============================================================================

-- Employee: can see own org's sponsorships
CREATE POLICY "employee_read_sponsorships" ON sponsorships
  FOR SELECT
  USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Board: read-only access
CREATE POLICY "board_read_sponsorships" ON sponsorships
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'board'
  );

-- ED Admin: full access
CREATE POLICY "ed_admin_all_sponsorships" ON sponsorships
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- ============================================================================
-- RLS Policies for content table
-- ============================================================================

-- Public: can see published content
CREATE POLICY "public_read_published_content" ON content
  FOR SELECT
  USING (published_at IS NOT NULL);

-- ED Admin: full access
CREATE POLICY "ed_admin_all_content" ON content
  FOR ALL
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'ed_admin'
  );

-- RLS Policy Templates (Adjust predicates for your auth implementation)
-- Assumptions:
-- 1. auth.uid() returns the authenticated user's UUID
-- 2. organization_members.user_id links a user to an organization
-- 3. site_field_members.contact_id relates to a contact which could map to user (extend later)

-- Enable RLS (if not already) - safe to run repeatedly
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_field_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_batch_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE onchain_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Helper: membership check
CREATE OR REPLACE VIEW v_user_organization_ids AS
SELECT om.user_id, om.organization_id
FROM organization_members om;

-- ORGANIZATIONS: members can see their orgs
DROP POLICY IF EXISTS select_organizations ON organizations;
CREATE POLICY select_organizations ON organizations
FOR SELECT USING (EXISTS (
  SELECT 1 FROM organization_members m WHERE m.organization_id = organizations.id AND m.user_id = auth.uid()
));

-- ORGANIZATION MEMBERS: self org scope
DROP POLICY IF EXISTS select_organization_members ON organization_members;
CREATE POLICY select_organization_members ON organization_members
FOR SELECT USING (organization_id IN (
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
));

-- PROJECTS
DROP POLICY IF EXISTS select_projects ON projects;
CREATE POLICY select_projects ON projects
FOR SELECT USING (organization_id IN (
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
));

-- SITES
DROP POLICY IF EXISTS select_sites ON sites;
CREATE POLICY select_sites ON sites
FOR SELECT USING (organization_id IN (
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
));

-- SITE FIELD MEMBERS (view only within org)
DROP POLICY IF EXISTS select_site_field_members ON site_field_members;
CREATE POLICY select_site_field_members ON site_field_members
FOR SELECT USING (site_id IN (
  SELECT s.id FROM sites s
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE m.user_id = auth.uid()
));

-- PLANTING BATCHES
DROP POLICY IF EXISTS select_planting_batches ON planting_batches;
CREATE POLICY select_planting_batches ON planting_batches
FOR SELECT USING (site_id IN (
  SELECT s.id FROM sites s
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE m.user_id = auth.uid()
));

-- MEASUREMENTS
DROP POLICY IF EXISTS select_measurements ON measurements;
CREATE POLICY select_measurements ON measurements
FOR SELECT USING (site_id IN (
  SELECT s.id FROM sites s
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE m.user_id = auth.uid()
));

-- PHOTOS
DROP POLICY IF EXISTS select_photos ON photos;
CREATE POLICY select_photos ON photos
FOR SELECT USING (site_id IN (
  SELECT s.id FROM sites s
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE m.user_id = auth.uid()
));

-- VERIFICATIONS (organization scope OR assigned in future)
DROP POLICY IF EXISTS select_verifications ON verifications;
CREATE POLICY select_verifications ON verifications
FOR SELECT USING ((site_id IS NULL OR site_id IN (
  SELECT s.id FROM sites s
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE m.user_id = auth.uid()
)) OR (project_id IS NOT NULL AND project_id IN (
  SELECT p.id FROM projects p
  JOIN organization_members m ON m.organization_id = p.organization_id
  WHERE m.user_id = auth.uid()
)));

-- ONCHAIN ANCHORS (project scope)
DROP POLICY IF EXISTS select_onchain_anchors ON onchain_anchors;
CREATE POLICY select_onchain_anchors ON onchain_anchors
FOR SELECT USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN organization_members m ON m.organization_id = p.organization_id
  WHERE m.user_id = auth.uid()
));

-- AUDIT LOG (restrict - only later by role; for now none)
DROP POLICY IF EXISTS select_audit_log ON audit_log;
CREATE POLICY select_audit_log ON audit_log
FOR SELECT USING (false);

-- CONTACTS (view if linked via site_field_members to an org site)
DROP POLICY IF EXISTS select_contacts ON contacts;
CREATE POLICY select_contacts ON contacts
FOR SELECT USING (EXISTS (
  SELECT 1 FROM site_field_members sfm
  JOIN sites s ON s.id = sfm.site_id
  JOIN organization_members m ON m.organization_id = s.organization_id
  WHERE sfm.contact_id = contacts.id AND m.user_id = auth.uid()
));

-- NOTE: Write policies (INSERT/UPDATE/DELETE) intentionally omitted; add role-based logic later.

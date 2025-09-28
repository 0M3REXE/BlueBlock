-- Migration: invitations system (organization member onboarding)
-- Creates invitations table for field/verifier onboarding + indexes + RLS enable.

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade not null,
  email text not null,
  role text not null check (role in ('field_agent','verifier')),
  site_ids uuid[] null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  invited_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_invitations_org on invitations(organization_id);
create index if not exists idx_invitations_email on invitations(lower(email));
create index if not exists idx_invitations_expires on invitations(expires_at);

alter table invitations enable row level security;

-- RLS Policy Templates (commented out; activate after auth wiring)
-- create policy "org_admin_manage_invitations" on invitations
--   for all using (
--     exists (
--       select 1 from organization_members om
--       where om.organization_id = invitations.organization_id
--         and om.user_id = auth.uid()
--         and om.role = 'org_admin'
--     )
--   ) with check (
--     exists (
--       select 1 from organization_members om
--       where om.organization_id = invitations.organization_id
--         and om.user_id = auth.uid()
--         and om.role = 'org_admin'
--     )
--   );

-- create policy "org_members_view_invitations" on invitations
--   for select using (
--     exists (
--       select 1 from organization_members om
--       where om.organization_id = invitations.organization_id
--         and om.user_id = auth.uid()
--     )
--   );

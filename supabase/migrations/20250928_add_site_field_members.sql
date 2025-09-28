-- Migration: add site_field_members join table to track field personnel assigned to each site
-- Run after initial schema.

create table if not exists site_field_members (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  role text, -- e.g. lead, technician, volunteer
  added_at timestamptz default now(),
  unique (site_id, contact_id)
);

create index if not exists idx_site_field_members_site on site_field_members(site_id);
create index if not exists idx_site_field_members_contact on site_field_members(contact_id);

alter table site_field_members enable row level security;

-- (Example policy placeholder, adjust later)
-- create policy "org_members_select_site_field" on site_field_members
--   for select using (
--     exists (
--       select 1 from organization_members om
--       join sites s on s.id = site_field_members.site_id
--       join projects p on p.id = s.project_id
--       where om.organization_id = p.organization_id
--         and om.user_id = auth.uid()
--     )
--   );

-- View to summarize field member counts per site (optional helper)
create or replace view site_field_member_counts as
  select s.id as site_id, count(sf.id) as field_member_count
  from sites s
  left join site_field_members sf on sf.site_id = s.id
  group by s.id;

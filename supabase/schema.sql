-- BlueBlock Initial Schema
-- Run this in Supabase SQL editor. Execute in chunks if needed.
-- Requires pgcrypto extension for gen_random_uuid(). Supabase usually enables it.

-- =============================================
-- 0. Extensions (safe create)
-- =============================================
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp"; -- optional

-- =============================================
-- 1. Enum / Domain Candidate Notes (using CHECKs for now)
-- (You may later convert to proper ENUM types.)
-- =============================================
-- qc_status: pending | approved | rejected
-- verification.status: initiated | in_review | accepted | rejected
-- roles: org_admin | field_agent | verifier | viewer

-- =============================================
-- 2. Core Tables
-- =============================================

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  country text,
  website text,
  created_at timestamptz default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('org_admin','field_agent','verifier','viewer')) not null,
  created_at timestamptz default now(),
  unique (organization_id, user_id)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  human_project_code text unique,
  name text not null,
  description text,
  region text,
  baseline_date date,
  restoration_method text,
  baseline_carbon_tco2e numeric,
  est_sequestration_tco2e numeric,
  methodology_version text,
  created_at timestamptz default now()
);

-- On-chain anchors table MUST exist before any referencing anchor_id FKs
create table if not exists onchain_anchors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  merkle_root text not null,
  record_count integer,
  from_timestamp timestamptz,
  to_timestamp timestamptz,
  algo_app_id bigint,
  tx_id text,
  anchor_index integer,
  created_at timestamptz default now()
);

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  location_name text,
  centroid_lat double precision,
  centroid_lon double precision,
  boundary_geojson jsonb,
  area_hectares numeric,
  habitat_type text,
  communities_notes text,
  created_at timestamptz default now()
);

create table if not exists communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

create table if not exists site_communities (
  site_id uuid references sites(id) on delete cascade,
  community_id uuid references communities(id) on delete cascade,
  role text,
  primary key (site_id, community_id)
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role text
);

create table if not exists project_contacts (
  project_id uuid references projects(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  contact_type text,
  primary key (project_id, contact_id)
);

create table if not exists species (
  id uuid primary key default gen_random_uuid(),
  common_name text,
  scientific_name text,
  functional_group text
);

create table if not exists planting_batches (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  batch_code text,
  planting_start date,
  planting_end date,
  source_nursery text,
  notes text,
  anchor_id uuid references onchain_anchors(id), -- forward reference (created later); will be null until anchored
  created_at timestamptz default now()
);

create table if not exists planting_batch_species (
  planting_batch_id uuid references planting_batches(id) on delete cascade,
  species_id uuid references species(id) on delete cascade,
  saplings_planted integer,
  primary key (planting_batch_id, species_id)
);

create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  measured_at timestamptz not null,
  protocol_version text,
  avg_height_cm numeric,
  survival_rate_percent numeric,
  data_quality_score integer,
  qc_status text check (qc_status in ('pending','approved','rejected')) default 'pending',
  created_by uuid references auth.users(id),
  anchor_id uuid references onchain_anchors(id), -- null until included in an anchor batch
  created_at timestamptz default now()
);

create table if not exists measurement_plots (
  id uuid primary key default gen_random_uuid(),
  measurement_id uuid references measurements(id) on delete cascade,
  plot_code text,
  sample_count integer,
  avg_height_cm numeric,
  survival_rate_percent numeric
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  storage_path text not null,
  taken_at timestamptz,
  lat double precision,
  lon double precision,
  height_m numeric,
  hash_sha256 text,
  captured_by uuid references auth.users(id),
  anchor_id uuid references onchain_anchors(id),
  created_at timestamptz default now()
);

create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  verifier_user_id uuid references auth.users(id),
  method text,
  status text check (status in ('initiated','in_review','accepted','rejected')) default 'initiated',
  report_summary text,
  report_document_path text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists verification_findings (
  id uuid primary key default gen_random_uuid(),
  verification_id uuid references verifications(id) on delete cascade,
  category text,
  severity text,
  message text
);

create table if not exists disturbance_events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  event_type text,
  occurred_at timestamptz,
  impact_notes text
);

create table if not exists audit_log (
  id bigserial primary key,
  actor_user_id uuid references auth.users(id),
  action text,
  entity_type text,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);

create table if not exists user_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  address text not null,
  is_primary boolean default true,
  created_at timestamptz default now(),
  unique (address)
);

-- =============================================
-- 3. Indexes
-- =============================================
create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_sites_project on sites(project_id);
create index if not exists idx_measurements_site_time on measurements(site_id, measured_at desc);
create index if not exists idx_photos_site_time on photos(site_id, taken_at desc);
create index if not exists idx_anchors_project on onchain_anchors(project_id, anchor_index desc);
create index if not exists idx_planting_batches_site on planting_batches(site_id);
create index if not exists idx_verifications_project on verifications(project_id);
create index if not exists idx_user_wallets_user on user_wallets(user_id);
create index if not exists idx_measurements_anchor on measurements(anchor_id);
create index if not exists idx_photos_anchor on photos(anchor_id);
create index if not exists idx_batches_anchor on planting_batches(anchor_id);

-- =============================================
-- 4. RLS (Row Level Security) Placeholders
-- Enable and then add policies suited to your logic.
-- =============================================
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table projects enable row level security;
alter table sites enable row level security;
alter table planting_batches enable row level security;
alter table planting_batch_species enable row level security;
alter table measurements enable row level security;
alter table measurement_plots enable row level security;
alter table photos enable row level security;
alter table verifications enable row level security;
alter table verification_findings enable row level security;
alter table disturbance_events enable row level security;
alter table onchain_anchors enable row level security;
alter table user_wallets enable row level security;

-- Example Policy Templates (commented out):
-- create policy "org_members_select_projects" on projects
--   for select using (
--     exists(
--       select 1 from organization_members om
--       where om.organization_id = projects.organization_id
--         and om.user_id = auth.uid()
--     )
--   );

-- create policy "org_admin_insert_projects" on projects
--   for insert with check (
--     exists(
--       select 1 from organization_members om
--       where om.organization_id = projects.organization_id
--         and om.user_id = auth.uid()
--         and om.role = 'org_admin'
--     )
--   );

-- =============================================
-- 5. Future / Optional Tables (commented)
-- =============================================
-- carbon_estimates, anchor_proofs, device_attestations, etc.

-- =============================================
-- 6. Helpful Views (examples, add later)
-- =============================================
-- create view site_latest_measurement as
--   select m.* from measurements m
--   join (
--     select site_id, max(measured_at) as max_time from measurements group by site_id
--   ) latest on latest.site_id = m.site_id and latest.max_time = m.measured_at;

-- =============================================
-- END OF SCHEMA

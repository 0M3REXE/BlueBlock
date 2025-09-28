// Lightweight TypeScript interfaces mirroring selected DB tables.
// These are NOT generated; keep in sync manually or replace with codegen later.

export interface Organization {
  id: string; name: string; legal_name?: string | null; country?: string | null; website?: string | null; created_at?: string;
}
export interface Project {
  id: string; organization_id: string; human_project_code?: string | null; name: string; description?: string | null;
  region?: string | null; baseline_date?: string | null; restoration_method?: string | null;
  baseline_carbon_tco2e?: number | null; est_sequestration_tco2e?: number | null; methodology_version?: string | null; created_at?: string;
}
// Minimal GeoJSON polygon typing (extend later if needed)
export type GeoJSONPolygon = {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][]; // simplified typing
};

export interface Site {
  id: string; project_id: string; name: string; location_name?: string | null; centroid_lat?: number | null; centroid_lon?: number | null;
  boundary_geojson?: GeoJSONPolygon | null; area_hectares?: number | null; habitat_type?: string | null; communities_notes?: string | null; created_at?: string;
}
export interface Measurement {
  id: string; site_id: string; measured_at: string; protocol_version?: string | null; avg_height_cm?: number | null;
  survival_rate_percent?: number | null; data_quality_score?: number | null; qc_status: 'pending' | 'approved' | 'rejected'; created_by?: string | null; anchor_id?: string | null; created_at?: string;
}
export interface Verification {
  id: string; project_id: string; verifier_user_id?: string | null; method?: string | null; status: 'initiated' | 'in_review' | 'accepted' | 'rejected';
  report_summary?: string | null; report_document_path?: string | null; created_at?: string; completed_at?: string | null;
}

export interface OnchainAnchor {
  id: string; project_id: string; merkle_root: string; record_count?: number | null; from_timestamp?: string | null; to_timestamp?: string | null;
  algo_app_id?: number | null; tx_id?: string | null; anchor_index?: number | null; created_at?: string; round?: number | null;
}
// Backwards alias (remove later)
export type Anchor = OnchainAnchor;

export interface PlantingBatch {
  id: string; site_id: string; batch_code?: string | null; planting_start?: string | null; planting_end?: string | null; source_nursery?: string | null; notes?: string | null; anchor_id?: string | null; created_at?: string;
}

export interface Photo {
  id: string; site_id: string; storage_path: string; taken_at?: string | null; lat?: number | null; lon?: number | null; height_m?: number | null;
  hash_sha256?: string | null; captured_by?: string | null; anchor_id?: string | null; created_at?: string;
}

export interface VerificationFinding { id: string; verification_id: string; category?: string | null; severity?: string | null; message?: string | null; }

export interface Contact {
  id: string; organization_id: string; full_name: string; email?: string | null; phone?: string | null; role?: string | null;
}

export interface SiteFieldMember {
  id: string; site_id: string; contact_id: string; role?: string | null; added_at?: string; contact?: Contact;
}

// New: Invitation + Organization Member augmentations
export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrgRoleInvite; // restricted subset
  site_ids?: string[] | null;
  token_hash: string;
  expires_at: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
  invited_by?: string | null;
  created_at?: string;
}

export type OrgMemberRole = 'org_admin' | 'field_agent' | 'verifier' | 'viewer';
export type OrgRoleInvite = 'field_agent' | 'verifier';

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgMemberRole;
  created_at?: string;
}

// Lightweight input helper for creating measurement client-side
export interface NewMeasurementInput {
  site_id: string; measured_at: string; planting_batch_id?: string | null; species_id?: string | null; tree_count?: number | null;
}

export type QCStatus = Measurement['qc_status'];
export type VerificationStatus = Verification['status'];

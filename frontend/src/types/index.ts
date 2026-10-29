export type UserRole =
  | 'APPLICANT'
  | 'SCRUTINY'
  | 'EVC'
  | 'COORDINATOR'
  | 'SHC'
  | 'SAC'
  | 'AUTHORITY'
  | 'RULES_ADMIN';

export interface User {
  id: number;
  email: string;
  full_name: string;
  mobile?: string;
  entity_type: string;
  portal: 'NSWS' | 'AICTE';
  role: UserRole;
  is_active: boolean;
}

export interface AICTEUser {
  id: number;
  aicte_user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  mobile?: string;
  department?: string;
  is_active: boolean;
  is_first_login: boolean;
}

export interface Approval {
  id: number;
  name: string;
  code: string;
  ministry: string;
  category: 'CENTRAL' | 'STATE';
  state?: string;
  description?: string;
  requirements_summary?: string;
  fee: number;
  sla_days: number;
  created_at: string;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  app: string;
  simulation_mode: boolean;
  notice: string;
  active_rule_version?: string;
  database_connected: boolean;
}

export interface SystemInfo {
  project_name: string;
  environment: string;
  simulation_banner: string;
  roles: string[];
  active_aph_handbook: string;
}

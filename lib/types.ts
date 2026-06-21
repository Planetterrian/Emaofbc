export type OrgType = 'corporate' | 'sole_proprietor' | 'ngo';
export type OrgStatus = 'active' | 'lapsed' | 'pending';
export type UserRole = 'employee' | 'org_admin' | 'board' | 'ed_admin';
export type EventType = 'monthly_session' | 'workshop' | 'tour' | 'golf' | 'gala';
export type EventStatus = 'draft' | 'published' | 'full' | 'past';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type AwardStatus = 'submitted' | 'under_review' | 'shortlisted' | 'decided';
export type SponsorshipTier = 'platinum' | 'gold' | 'silver' | 'bronze';
export type ContentType = 'post' | 'recap' | 'archive';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  address?: string;
  employee_count_band?: string;
  focus?: string;
  website?: string;
  logo_url?: string;
  email_domain?: string;
  directory_opt_in: boolean;
  status: OrgStatus;
  paid_through?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  org_id: string;
  period_start: string;
  period_end: string;
  tier: OrgType;
  amount_cents: number;
  status: 'paid' | 'unpaid' | 'prorated';
  stripe_ref?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  speaker?: string;
  venue?: string;
  starts_at: string;
  capacity?: number;
  member_price_cents?: number;
  nonmember_price_cents?: number;
  pd_eligible: boolean;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  org_id?: string;
  price_paid_cents?: number;
  payment_status: PaymentStatus;
  attended: boolean;
  pd_credit_recorded: boolean;
  created_at: string;
  updated_at: string;
}

export interface PDCredit {
  id: string;
  user_id: string;
  event_id: string;
  credits: number;
  recorded_at: string;
}

export interface Award {
  id: string;
  category: string;
  org_id: string;
  submitter_user_id: string;
  materials_url?: string;
  status: AwardStatus;
  created_at: string;
  updated_at: string;
}

export interface Sponsorship {
  id: string;
  event_id: string;
  org_id: string;
  tier: SponsorshipTier;
  amount_cents: number;
  payment_status: PaymentStatus;
  asset_url?: string;
  placement_status: 'pending' | 'placed' | 'removed';
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  body?: string;
  event_id?: string;
  published_at?: string;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

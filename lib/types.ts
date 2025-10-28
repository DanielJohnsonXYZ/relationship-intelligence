export type RelationshipTemperature = 'cold' | 'warm' | 'hot';
export type SignalType = 'article' | 'press' | 'job_change' | 'funding' | 'speaking' | 'social_post' | 'product_launch' | 'other';
export type MessageChannel = 'email' | 'linkedin' | 'twitter' | 'manual';
export type MessageStatus = 'draft' | 'sent' | 'replied' | 'ignored' | 'skipped';

export interface Person {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  tags: string[];
  priority: number;

  // Links to monitor
  linkedin_url?: string;
  twitter_handle?: string;
  company_domain?: string;
  personal_website?: string;

  // Relationship state
  last_contact_date?: string;
  next_contact_date: string;
  responsiveness_score: number;
  relationship_temperature: RelationshipTemperature;

  // Context for AI
  notes?: string;
  communication_style?: string;
  interests: string[];

  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  person_id: string;
  signal_type: SignalType;
  title: string;
  description?: string;
  url?: string;
  source: string;
  relevance_score: number;
  detected_at: string;
  processed: boolean;
  used_in_message: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  person_id: string;
  signal_ids: string[];
  draft: string;
  final_sent?: string;
  channel: MessageChannel;
  status: MessageStatus;
  sent_at?: string;
  replied_at?: string;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonWithSignals extends Person {
  signals?: Signal[];
}

export interface MessageWithPerson extends Message {
  person?: Person;
}

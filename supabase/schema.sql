-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- People table
create table public.people (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  company text,
  role text,
  tags text[] default '{}',
  priority integer default 5 check (priority >= 1 and priority <= 10),

  -- Links to monitor
  linkedin_url text,
  twitter_handle text,
  company_domain text,
  personal_website text,

  -- Relationship state
  last_contact_date timestamptz,
  next_contact_date timestamptz default now(),
  responsiveness_score integer default 50 check (responsiveness_score >= 0 and responsiveness_score <= 100),
  relationship_temperature text default 'warm' check (relationship_temperature in ('cold', 'warm', 'hot')),

  -- Context for AI
  notes text,
  communication_style text,
  interests text[] default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Signals table
create table public.signals (
  id uuid default uuid_generate_v4() primary key,
  person_id uuid references public.people(id) on delete cascade not null,
  signal_type text not null check (signal_type in ('article', 'press', 'job_change', 'funding', 'speaking', 'social_post', 'product_launch', 'other')),
  title text not null,
  description text,
  url text,
  source text not null,
  relevance_score integer default 50 check (relevance_score >= 0 and relevance_score <= 100),
  detected_at timestamptz default now(),
  processed boolean default false,
  used_in_message boolean default false,
  created_at timestamptz default now()
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  person_id uuid references public.people(id) on delete cascade not null,
  signal_ids uuid[] default '{}',
  draft text not null,
  final_sent text,
  channel text not null check (channel in ('email', 'linkedin', 'twitter', 'manual')),
  status text default 'draft' check (status in ('draft', 'sent', 'replied', 'ignored', 'skipped')),
  sent_at timestamptz,
  replied_at timestamptz,
  ai_reasoning text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index idx_people_next_contact on public.people(next_contact_date);
create index idx_people_priority on public.people(priority desc);
create index idx_signals_person on public.signals(person_id);
create index idx_signals_processed on public.signals(processed) where not processed;
create index idx_messages_person on public.messages(person_id);
create index idx_messages_status on public.messages(status);

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_people_updated_at before update on public.people
  for each row execute procedure update_updated_at_column();

create trigger update_messages_updated_at before update on public.messages
  for each row execute procedure update_updated_at_column();

-- Row Level Security (RLS) - for now, we'll keep it simple since it's single-user
-- You can enable this later when you add auth
alter table public.people enable row level security;
alter table public.signals enable row level security;
alter table public.messages enable row level security;

-- Allow all operations for service role (you'll use this for now)
create policy "Allow all for service role" on public.people for all using (true);
create policy "Allow all for service role" on public.signals for all using (true);
create policy "Allow all for service role" on public.messages for all using (true);

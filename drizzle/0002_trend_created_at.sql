alter table trend_observations
  add column if not exists created_at timestamptz not null default now();


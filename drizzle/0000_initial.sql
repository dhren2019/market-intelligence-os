create table if not exists data_sources (
  id text primary key, slug text not null unique, name text not null,
  documentation_url text not null, scope text not null, license text not null,
  auth_required boolean not null default false, status text not null default 'active',
  rate_limit text, cost text not null default 'free', last_fetched_at timestamptz,
  last_published_at timestamptz, last_error text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists source_runs (
  id text primary key, source_id text not null references data_sources(id), run_key text,
  status text not null, started_at timestamptz not null default now(), completed_at timestamptz,
  fetched_records integer not null default 0, inserted_records integer not null default 0,
  error text, metadata jsonb not null default '{}'::jsonb
);

create table if not exists source_documents (
  id text primary key, source_id text not null references data_sources(id), external_id text,
  source_url text not null, published_at timestamptz, fetched_at timestamptz not null,
  content_hash text not null unique, raw_payload jsonb not null
);

create table if not exists sector_definitions (
  id text primary key, name text not null, sector_code text, sector_taxonomy text,
  country text not null, methodology text not null, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists sector_observations (
  id text primary key, source_id text not null references data_sources(id), sector_code text,
  sector_taxonomy text, sector_name text not null, metric_name text not null,
  value numeric not null, unit text not null, currency text, country text not null,
  period text not null, observed_at timestamptz not null, source_url text not null,
  claim_type text not null, methodology_version text not null, raw_payload jsonb not null
);

create table if not exists trend_topics (
  id text primary key, slug text not null unique, name text not null,
  category text not null, followed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists trend_observations (
  id text primary key, external_id text, source_id text not null references data_sources(id),
  topic text not null, metric_name text not null, value numeric not null, unit text not null,
  country text not null, period text not null, observed_at timestamptz not null,
  published_at timestamptz, fetched_at timestamptz not null, source_url text not null,
  data_quality text not null, claim_type text not null, methodology_version text not null,
  content_hash text not null unique, raw_payload jsonb not null
);

create table if not exists demand_signals (
  id text primary key, source_id text not null references data_sources(id), external_id text,
  buyer text, country text, region text, category text, concept text not null,
  amount numeric, currency text, status text not null, deadline timestamptz,
  published_at timestamptz, fetched_at timestamptz not null, source_url text not null,
  claim_type text not null, content_hash text not null unique, raw_payload jsonb not null
);

create table if not exists companies (
  id text primary key, name text not null, website text, country text, buyer_persona text,
  source_url text, reviewed_at timestamptz, raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists company_products (
  id text primary key, company_id text not null references companies(id), name text not null,
  description text, monetization text, source_url text, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists pricing_observations (
  id text primary key, company_id text not null references companies(id), plan_name text,
  amount numeric, currency text, billing_period text, claim_type text not null default 'observed',
  source_url text not null, observed_at timestamptz not null, raw_payload jsonb not null
);

create table if not exists revenue_claims (
  id text primary key, company_id text not null references companies(id), amount numeric,
  currency text, period_type text not null, evidence_type text not null, claim_type text not null,
  source_url text not null, observed_at timestamptz not null, raw_payload jsonb not null
);

create table if not exists funding_events (
  id text primary key, company_id text references companies(id), event_type text not null,
  amount numeric, currency text, announced_at timestamptz, source_url text not null,
  claim_type text not null, raw_payload jsonb not null
);

create table if not exists investors (
  id text primary key, name text not null, website text, country text, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists investment_theses (
  id text primary key, investor_id text not null references investors(id), thesis_type text not null,
  vertical text not null, published_at timestamptz, source_url text not null, raw_payload jsonb not null
);

create table if not exists opportunities (
  id text primary key, external_id text not null unique, name text not null, category text not null,
  buyer text not null, opportunity_type text not null, scoring_model text not null,
  status text not null default 'idea', legacy_score integer, evidence_score numeric,
  build_score numeric, claim_type text not null, source_url text,
  source_workbook text not null, source_sheet text not null, source_row integer not null,
  origin text not null, raw_payload jsonb not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists opportunity_evidence (
  id text primary key, opportunity_id text not null references opportunities(id),
  source_id text references data_sources(id), claim_type text not null, summary text not null,
  source_url text, observed_at timestamptz, quality text, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists opportunity_scores (
  id text primary key, opportunity_id text not null references opportunities(id), model text not null,
  score numeric, weights jsonb not null, components jsonb not null, reason text not null,
  calculated_at timestamptz not null default now()
);

create table if not exists validation_experiments (
  id text primary key, opportunity_id text not null references opportunities(id), status text not null,
  experiment_type text not null, hypothesis text not null, result text,
  started_at timestamptz, completed_at timestamptz, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists customer_contacts (
  id text primary key, opportunity_id text references opportunities(id), company_name text,
  role text, channel text, public_contact text, status text not null,
  contacted_at timestamptz, next_step text, raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists imports (
  id text primary key, filename text not null, content_hash text not null unique, mime_type text,
  status text not null, accepted_rows integer not null default 0, rejected_rows integer not null default 0,
  imported_at timestamptz not null default now(), raw_metadata jsonb not null default '{}'::jsonb
);

create table if not exists import_rejections (
  id text primary key, import_id text not null references imports(id), line_number integer,
  reason text not null, raw_payload jsonb, created_at timestamptz not null default now()
);

create table if not exists forecasts (
  id text primary key, topic text not null, horizon_days integer not null, method text not null,
  status text not null, point_value numeric, lower_value numeric, upper_value numeric,
  unit text, generated_at timestamptz not null, methodology_version text not null,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists forecast_backtests (
  id text primary key, forecast_id text not null references forecasts(id), baseline_method text not null,
  model_error numeric, baseline_error numeric, sample_size integer not null, passed boolean not null,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists user_settings (
  id text primary key, setting_key text not null unique, setting_value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists daily_runs (
  id text primary key, run_key text not null unique, status text not null,
  started_at timestamptz not null default now(), completed_at timestamptz,
  summary jsonb not null default '{}'::jsonb
);


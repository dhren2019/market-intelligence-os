create table if not exists import_records (
  id text primary key,
  import_id text not null references imports(id),
  line_number integer,
  record_type text not null,
  claim_type text not null,
  content_hash text not null unique,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);


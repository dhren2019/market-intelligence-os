delete from trend_observations as duplicate
where exists (
  select 1
  from trend_observations as keeper
  where keeper.source_id = duplicate.source_id
    and keeper.external_id is not distinct from duplicate.external_id
    and keeper.value = duplicate.value
    and keeper.unit = duplicate.unit
    and keeper.methodology_version = duplicate.methodology_version
    and keeper.id < duplicate.id
);

create unique index if not exists trend_observations_identity_uq
on trend_observations (source_id, external_id, value, unit, methodology_version);

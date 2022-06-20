create or replace function add_photo (
  p_user_id int,
  p_uri varchar,
  p_created_at date
)
  returns int
  language plpgsql
as
$$
declare
  v_id int;
begin
  insert into
    photos (user_id, uri, created_at)
    values (p_user_id, p_uri, p_created_at)
    returning id into v_id;
  return v_id;
end
$$;

create or replace function get_photos (p_user_id int)
  returns table (j json)
  language plpgsql
as
$$
begin
  return query select json_agg(t) from (
    select * from photos p where p.user_id = p_user_id
  ) t;
end
$$;

create or replace function add_profile (
  p_user_id int,
  p_platform varchar,
  p_code varchar
)
  returns int
  language plpgsql
as
$$
declare
  v_id int;
begin
  insert into
    profiles (user_id, platform, code)
    values (p_user_id, p_platform, p_code)
    returning id into v_id;
  return v_id;
end
$$;

create or replace function get_profile (p_id int)
  returns table (j json)
  language plpgsql
as
$$
begin
  return query select json_agg(t) from (
    select * from profiles p where p.id = p_id
  ) t;
end
$$;

create or replace function get_profiles (p_user_id int)
  returns table (j json)
  language plpgsql
as
$$
begin
  return query select json_agg(t) from (
    select * from profiles p where p.user_id = p_user_id
  ) t;
end
$$;

create or replace function set_profile_token (
  p_id int,
  p_token varchar
)
  returns varchar
  language plpgsql
as
$$
begin
  update profiles p set token = p_token where p.id = p_id;
  return p_token;
end
$$;

create or replace function delete_profile (p_id int)
  returns int
  language plpgsql
as
$$
begin
  delete from profiles p where p.id = p_id;
  return p_id;
end
$$;

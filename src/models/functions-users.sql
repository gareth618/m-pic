create or replace function sign_in (
  p_email varchar,
  p_password varchar
)
  returns varchar
  language plpgsql
as
$$
declare
  v_id int;
  v_password varchar;
begin
  select id, password
    into v_id, v_password
    from users u
    where u.email = p_email;
  if not found or p_password <> v_password then
    return -1;
  else
    return v_id;
  end if;
end
$$;

create or replace function sign_up (
  p_email varchar,
  p_password varchar
)
  returns varchar
  language plpgsql
as
$$
declare
  v_count int;
  v_id int;
begin
  select count(*)
    into v_count
    from users u
    where u.email = p_email;
  if v_count = 0 then
    insert into
      users (email, password)
      values (p_email, p_password)
      returning id into v_id;
    return v_id;
  else
    return -1;
  end if;
end
$$;

create or replace function delete_user (p_id int)
  returns int
  language plpgsql
as
$$
begin
  delete from users u where u.id = p_id;
  return p_id;
end
$$;

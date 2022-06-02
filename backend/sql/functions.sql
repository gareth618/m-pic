-----------
-- USERS --
-----------

create or replace function sign_in (p_email varchar, p_password varchar)
  returns varchar
  language plpgsql
as
$$
declare
  user_id int;
  user_password users.password%type;
begin
  select id, password
    into user_id, user_password
    from users u
    where u.email = p_email;
  if not found or p_password <> user_password then
    return 'wrong username or password';
  else
    return 'signed in user with id ' || user_id;
  end if;
end
$$;

create or replace function sign_up (p_email varchar, p_password varchar)
  returns varchar
  language plpgsql
as
$$
declare
  count_users int;
  new_id int;
begin
  select count(*)
    into count_users
    from users u
    where u.email = p_email;
  if count_users = 0 then
    insert into
      users (email, password)
      values (p_email, p_password)
      returning id into new_id;
    return 'created user with id ' || new_id;
  else
    return 'email already in use';
  end if;
end
$$;

create or replace procedure delete_user (p_id int)
  language plpgsql
as
$$
begin
  delete
    from users u
    where u.id = p_id;
end
$$;

--------------
-- PROFILES --
--------------

create or replace function add_profile (p_id_user int, p_platform varchar)
  returns varchar
  language plpgsql
as
$$
declare
  count_profiles int;
  new_id int;
begin
  select count(*)
    into count_profiles
    from profiles p
    where p.id_user = p_id_user and p.platform = p_platform;
  if count_profiles = 0 then
    insert into
      profiles (id_user, platform, logged_in)
      values (p_id_user, p_platform, true)
      returning id into new_id;
    return 'created profile with id ' || new_id;
  else
    return 'platform already in use';
  end if;
end
$$;

create or replace procedure delete_profile (p_id int)
  language plpgsql
as
$$
begin
  delete
    from profiles p
    where p.id = p_id;
end
$$;

------------
-- IMAGES --
------------

-- post_image(id_user, post_file, post_text, post_tags, post_profiles_ids)
---- creează imaginea
---- adaugă relațiile dintre imagine și tag-uri
------ dacă un tag nu există, îl creează
---- adaugă relațiile dintre imagine și profiluri
------ dacă un id de profil este invalid îl ignoră
---- returnează id-ul imaginii

-- search_images(id_user, tags, profiles)
---- selectează toate imaginile (doar id-uri) care fac match la măcar un tag sau profil
---- asociază fiecărei imagini un scor egal cu numărul de tag-uri și profile match-uite
---- sortează imaginile descrescător după scor
---- returnează imaginile (nu doar id-uri) ca json

-- create user mpic with password 'mpic';

drop table profiles;
drop table users;

create table users (
	email varchar(100) primary key,
	password varchar(100) not null
);

create table profiles (
	id serial primary key,
	email varchar(100),
	platform varchar(100) not null,
	logged_in boolean not null,
	constraint fkey_email foreign key (email)
		references users (email) on delete cascade
);


create or replace function sign_in (p_email varchar, p_password varchar)
	returns varchar
	language plpgsql
as
$$
declare
	correct_password users.password%type;
begin
	select password into correct_password from users where users.email = p_email;
	if not found then
		return 'user ' || p_email || ' does not exist';
	else
		if p_password <> correct_password then
			return 'wrong password';
		else
			return 'ok';
		end if;
	end if;
end;
$$;


create or replace function sign_up (p_email varchar, p_password varchar)
	returns varchar
	language plpgsql
as
$$
declare
	count_users int;
begin
	select count(*) into count_users from users where users.email = p_email;
	if count_users = 0 then
		insert into users (email, password) values (p_email, p_password);
		return 'ok';
	else
		return 'the email ' || p_email || ' is already in use';
	end if;
end;
$$;


create or replace procedure delete_user (p_email varchar)
	language plpgsql
as
$$
begin
	delete from users where users.email = p_email;
end;
$$;


create or replace function add_profile (p_email varchar, p_platform varchar, p_logged_in boolean)
	returns varchar
	language plpgsql
as
$$
declare
	count_profiles int;
begin
	select count(*) into count_profiles from profiles where profiles.email = p_email and profiles.platform = p_platform;
	if count_profiles = 0 then
		insert into profiles (email, platform, logged_in) values (p_email, p_platform, p_logged_in);
		return 'ok';
	else
		return 'the ' || p_platform || ' profile using the email ' || p_email || ' already exists';
	end if;
end;
$$;


create or replace procedure delete_profile (p_email varchar, p_platform varchar)
	language plpgsql
as
$$
begin
	delete from profiles where profiles.email = p_email and profiles.platform = p_platform;
end;
$$;

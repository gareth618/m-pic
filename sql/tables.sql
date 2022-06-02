drop table if exists image_tag;
drop table if exists image_profile;
drop table if exists tags;
drop table if exists images;
drop table if exists profiles;
drop table if exists users;

create table users (
  id serial primary key,
  email varchar(50) not null,
  password varchar(50) not null
);

create table profiles (
  id serial primary key,
  id_user int not null,
  platform varchar(10) not null,
  logged_in boolean not null,

  constraint fkey_profiles_users
    foreign key (id_user)
    references users (id)
    on delete cascade
);

create table images (
  id serial primary key,
  id_user int not null,
  post_file bytea, -- o să fie not null
  post_text varchar(1000) not null,
  post_date timestamp not null,

  constraint fkey_images_users
    foreign key (id_user)
    references users (id)
    on delete cascade
);

create table tags (
  id serial primary key,
  title varchar(50) not null
);

create table image_profile (
  id_image int not null,
  id_profile int not null,

  constraint fkey_image_profile_images
    foreign key (id_image)
    references images (id)
    on delete cascade,

  constraint fkey_image_profile_profiles
    foreign key (id_profile)
    references profiles (id)
    on delete cascade
);

create table image_tag (
  id_image int not null,
  id_tag int not null,

  constraint fkey_image_tag_images
    foreign key (id_image)
    references images (id)
    on delete cascade,

  constraint fkey_image_tag_tags
    foreign key (id_tag)
    references tags (id)
    on delete cascade
);

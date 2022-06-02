select sign_up ('user1@site.com', 'pass1');
select sign_up ('user2@site.com', 'pass2');
select sign_up ('user3@site.com', 'pass3');

select sign_up ('user4@site.com', 'pass4');
select sign_up ('user4@site.com', 'pass5');
call delete_user (4);

select sign_in ('user0@site.com', 'pass2');
select sign_in ('user1@site.com', 'pass2');
select sign_in ('user1@site.com', 'pass1');

select add_profile (1, 'facebook');
select add_profile (1, 'instagram');
select add_profile (1, 'instagram');
select add_profile (2, 'twitter');

select post_image (
  1,
  bytea('D:/m-pic/frontend/assets/photos/jpg/1.jpg'),
  array['snail', 'flower'],
  array[1, 2, 3],
  'Hello World! I am a beautiful snail on a beautiful flower :)'
);
select post_image (
  2,
  bytea('D:/m-pic/frontend/assets/photos/jpg/20.jpg'),
  array['flower', 'yellow', 'nature'],
  array[3, 4]
);

select * from users;
select * from profiles;
select * from images;
select * from tags;
select * from image_profile;
select * from image_tag;

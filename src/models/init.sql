select sign_up ('user1@site.com', 'pass1');
select sign_up ('user2@site.com', 'pass2');
select sign_up ('user3@site.com', 'pass3');

select sign_up ('user4@site.com', 'pass4');
select sign_up ('user4@site.com', 'pass5');
call delete_user (4);

select sign_in ('user0@site.com', 'pass2');
select sign_in ('user1@site.com', 'pass2');
select sign_in ('user1@site.com', 'pass1');

-- select add_profile (1, 'facebook');
-- select add_profile (1, 'instagram');
-- select add_profile (1, 'instagram');
-- select add_profile (2, 'twitter');

-- select post_image (
--   1,
--   bytea('D:/m-pic/frontend/assets/photos/jpg/1.jpg'),
--   array[1, 2, 3],
--   array['snail', 'flower'],
--   'Hello World! I am a beautiful snail on a beautiful flower :)'
-- );
-- select post_image (
--   2,
--   bytea('D:/m-pic/frontend/assets/photos/jpg/20.jpg'),
--   array[3, 4],
--   array['flower', 'yellow', 'nature']
-- );

-- select search_images (
--   1,
--   array[1, 2],
--   array['flower']
-- );
-- select search_images (
--   2,
--   array[3],
--   array['flower', 'nature']
-- );

-- select * from users;
-- select * from profiles;
-- select * from images;
-- select * from tags;
-- select * from image_profile;
-- select * from image_tag;
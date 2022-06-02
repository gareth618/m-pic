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

select * from users;
select * from profiles;

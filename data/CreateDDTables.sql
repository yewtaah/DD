CREATE TABLE players (PID SERIAL, LAST_NAME varchar(100), FIRST_NAME varchar(100), PHONE varchar(12), EMAIL varchar(100));
insert into players (last_name, first_name, phone, email) values 'Bateman','Scott','7132564719','yewtaah@yahoo.com');

CREATE TABLE games (GID SERIAL, NAME varchar(100), DESCRIPTION varchar, SNAFU varchar, SAVIOR varchar);
insert into games (name, description, SNAFU, SAVIOR) values ('Skeet','What better way to kickoff the tournament than blasting off some shells with a shotgun! This year we''ll be on private property, so will use a manual pull thrower to send 25 clay pigeons into the Texas sky. Each player will get 25 shots and tabulate the number of hits (partial or dusted).','The lurking penalty at skeet will be imposed on anyone hitting less than 10 targets: shotgun a beer','Each player will roll a singe dice before shooting. The number that comes up determines the lucky pull. If the player smashes the number target (3 on dice means 3rd target) play will receive an extra point on their final ranking score.');

insert into games (name, description, SNAFU, SAVIOR) values ('Home Run Derby', 'This is the event that spawned the idea for the Darwin Decathlon. Non-professional adults have very few options when trying to hit a baseball over a fence. Many of us used to play America''s favorite pasttime on a team and love hitting home runs and you know it just isn''t the same with a softball.
 
A pitching machine will be used to provide consistent pitches to each batter. You get 10 swings to hit as many balls over the designated home run fence as possible.
 
Ties result in a sudden death swing-off where tying players have to continue to hit home runs. First player to miss one takes the lower place ranking. "Outfield on Fly" rule is optional depending on whether or not the field provides a clear boundary line.

Home Run: 5 points
Fence Touch: 2 points
Outfield on Fly: 1 point', 'Less than 10 points total and you have to put an entire bag of Big League Chew in your mouth at once.', 'Dice roll determines your lucky shot - double your HR derby points on that swing')

insert into games (name, description, SNAFU, SAVIOR) values ('Washers', 'Game of washers will be played to 21 points with each player standing next to the box without stepping in front of it. Net scoring is used so if one team scores 4 points while their opponents have 1 point, 3 net (4-1) points are awarded. To win, a team must score exactly 21 points. If you bust, you go back to 11.', 'Miss the board with all washers 2 rounds in a row and it will cost you 10 push ups', 'Each team gets one veto where they can reject a washer throw before it is made. This can be done at any time and the opposing team must surrender that one washer.')
insert into games (name, description, SNAFU, SAVIOR) values ('Disc Golf', 'We''ll be making our own 18 hole course this year by bringing the disc baskets we have. Some baskets will be shared between holes. Regular disc golf rules apply including that a player must maintain balance behind the front edge of their disc even after throwing.', 'Hole in one means everyone except the thrower takes a liquor shot', 'Hole #9 will be a closest to the pin challenge - winner gets 2 stokes off total score')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')
insert into games (name, description, SNAFU, SAVIOR) values ('', '', '', '')


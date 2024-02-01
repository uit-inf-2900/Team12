-- Enforce foreign key constraints
PRAGMA foreign_keys = ON;

-- Tests for userLogIn table
-- Create valid user entries
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(123, 'ssl028@uit.no', 'StikkingErKult');

INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(666, 'satan@hell.com', 'AllHailSatan');

INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(55, 'student@uit.no', 'JegErStudent');

-- Tests for invalid user entries
-- New user entry with same userID
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(123, 'xxx000@uit.no', 'StikkingErKult');

-- New user entry with same userEmail
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(6000, 'ssl028@uit.no', 'StikkingErKult');


-- Tests for userInfo table
--  Valid user entry
INSERT INTO userInfo(userID, userFullName, age, gender)
VALUES(123, 'Skjalg Alexander Slubowski', 22, 'male');

-- Tests for invalid user entries
-- Invalid userID
INSERT INTO userInfo(userID, userFullName, age, gender)
VALUES(6969, 'Emilie Steen', 23, 'female');

-- Invalid gender
INSERT INTO userInfo(userID, userFullName, age, gender)
VALUES(666, 'Satan', 666, 'attack helicopter');
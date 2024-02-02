-- Enforce foreign key constraints
PRAGMA foreign_keys = ON;

-- Tests for userLogIn table
-- Create valid user entries
INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(123, 'ssl028@uit.no', 'StikkingErKult', 'verified');

INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(666, 'satan@hell.com', 'AllHailSatan', 'unverified');

INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(55, 'student@uit.no', 'JegErStudent', 'verified');

-- Tests for invalid user entries
-- New user entry with same userID
INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(123, 'xxx000@uit.no', 'StikkingErKult', 'verified');

-- New user entry with same userEmail
INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(6000, 'ssl028@uit.no', 'StikkingErKult', 'unverified');

-- New user entry with invalid userStatus
INSERT INTO userLogIn(userID, userEmail, userPwd, userStatus)
VALUES(512, 'invalid@uit.no', 'GreatPassword', 'invalid');


-- Tests for userInfo table
--  Valid user entry
INSERT INTO userInfo(userID, userFullName, userAge, userGender, userType)
VALUES(123, 'Skjalg Alexander Slubowski', 22, 'male', 'admin');

-- Tests for invalid user entries
-- Invalid userID
INSERT INTO userInfo(userID, userFullName, userAge, userGender, userType)
VALUES(6969, 'Emilie Steen', 23, 'female', 'user');

-- Invalid gender
INSERT INTO userInfo(userID, userFullName, userAge, userGender, userType)
VALUES(666, 'Satan', 666, 'attack helicopter', 'user');

-- Invalid userType
INSERT INTO userInfo(userID, userFullName, userAge, userGender, userType)
VALUES(55, 'Student', 23, 'non-binary', 'student');

-- Total errros should be 6
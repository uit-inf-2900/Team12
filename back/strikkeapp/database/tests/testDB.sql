-- Enforce foreign key constraints
PRAGMA foreign_keys = ON;

-- Tests for userLogIn table
-- Create valid user entries
INSERT INTO userLogIn(userEmail, userPwd, userStatus)
VALUES('ssl028@uit.no', 'StikkingErKult', 'verified');

INSERT INTO userLogIn(userEmail, userPwd, userStatus)
VALUES('satan@hell.com', 'AllHailSatan', 'unverified');

INSERT INTO userLogIn(userEmail, userPwd, userStatus)
VALUES('student@uit.no', 'JegErStudent', 'verified');

-- Tests for invalid user entries
-- Attempt to insert a new user with the same userEmail
INSERT INTO userLogIn(userEmail, userPwd, userStatus)
VALUES('ssl028@uit.no', 'DifferentPassword', 'verified');

-- Attempt to insert a new user with an invalid userStatus
INSERT INTO userLogIn(userEmail, userPwd, userStatus)
VALUES('invalid@uit.no', 'GreatPassword', 'invalid');



-- Tests for userInfo table
--  Valid user entry
INSERT INTO userInfo(userID, userFullName, userDateOfBirth, userGender, userType)
VALUES(1, 'Skjalg Alexander Slubowski', 03032001, 'male', 'admin');

-- Tests for invalid user entries
-- Invalid userID
INSERT INTO userInfo(userID, userFullName, userDateOfBirth, userGender, userType)
VALUES(6969, 'Invalid User', 01012001, 'female', 'user');

-- Invalid gender
INSERT INTO userInfo(userID, userFullName, userDateOfBirth, userGender, userType)
VALUES(2, 'Satan', 0606666, 'attack helicopter', 'user');

-- Invalid userType
INSERT INTO userInfo(userID, userFullName, userDateOfBirth, userGender, userType)
VALUES(3, 'Student', 01012001, 'non-binary', 'student');

-- Total errros should be 5
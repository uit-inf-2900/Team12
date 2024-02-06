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
INSERT INTO userDetails(userID, userFullName, userDateOfBirth, userType)
VALUES(1, 'Skjalg Alexander Slubowski', 03032001, 'admin');

-- Tests for invalid user entries
-- Invalid userID
INSERT INTO userDetails(userID, userFullName, userDateOfBirth, userType)
VALUES(6969, 'Invalid User', 01012001, 'user');



-- Invalid userType
INSERT INTO userDetails(userID, userFullName, userDateOfBirth, userType)
VALUES(3, 'Student', 01012001, 'student');

-- Total errros should be 4
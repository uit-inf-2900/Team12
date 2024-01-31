-- Create new user entry
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(123, 'ssl028@uit.no', 'StikkingErKult');

-- New user entry with same userID
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(123, 'xxx000@uit.no', 'StikkingErKult');

-- New user entry with same userEmail
INSERT INTO userLogIn(userID, userEmail, userPwd)
VALUES(666, 'ssl028@uit.no', 'StikkingErKult');
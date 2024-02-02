-- Enforce foreign key constraints
PRAGMA foreign_keys = ON;

-- Create the "userLogIn" table
CREATE TABLE IF NOT EXISTS userLogIn (
    userID INTEGER PRIMARY KEY,
    userEmail TEXT UNIQUE,
    userPwd TEXT,
    userStatus TEXT CHECK (userStatus IN ('unverified', 'verified', 'banned', 'inactive'))
);

-- Create the "userInfo" table with a foreign key reference to "userLogIn"
CREATE TABLE IF NOT EXISTS userInfo (
    userID INTEGER PRIMARY KEY,
    userFullName TEXT,
    userAge INTEGER CHECK (userAge > 0),
    userGender TEXT CHECK (userGender IN ('male', 'female', 'non-binary')),
    userType TEXT CHECK (userType IN ('admin', 'user')),
    FOREIGN KEY (userID) REFERENCES userLogIn(userID)
);


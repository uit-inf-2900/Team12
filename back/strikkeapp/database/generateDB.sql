-- Create the "userLogIn" table
CREATE TABLE IF NOT EXISTS userLogIn (
    userID INTEGER PRIMARY KEY,
    userEmail TEXT UNIQUE,
    userPwd TEXT
);

-- Create the "userInfo" table with a foreign key reference to "userLogIn"
CREATE TABLE IF NOT EXISTS userInfo (
    userID INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER CHECK (age > 0),
    gender TEXT CHECK (gender IN ('male', 'female', 'non-binary')),
    FOREIGN KEY (userID) REFERENCES userLogIn(userID)
);

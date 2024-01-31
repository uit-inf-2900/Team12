#!/bin/bash

# File names
db_file="userInfoTest.db"
sql_file="../generateDB.sql"
sql_test="testDB.sql"

# Create database if it does not exsist
if [ ! -e "$db_file" ]; then
    sqlite3 "$db_file" < "$sql_file"
    echo "$db_file has been created"

# Message if it exsists
else
    echo "$db_file already exists."
fi

sqlite3 "$db_file" < "$sql_test"
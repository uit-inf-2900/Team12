#!/bin/bash

# File names
db_file="userInfoTest.db"
sql_file="../generateDB.sql"
sql_test="testDB.sql"

# Create database
sqlite3 "$db_file" < "$sql_file"
echo "$db_file has been created"


sqlite3 "$db_file" < "$sql_test"

## Delete database
#rm "$db_file"
#echo "$db_file has been deleted"
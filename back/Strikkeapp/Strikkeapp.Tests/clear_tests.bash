#!/bin/bash

# Check if CoverageReports folder exists
if [ -d "CoverageReports" ]; then
    echo "Removing CoverageReports folder..."
    rm -rf "CoverageReports"
    echo "CoverageReports folder removed."
else
    echo "CoverageReports folder does not exist."
fi

# Check if TestResults folder exists
if [ -d "TestResults" ]; then
    echo "Removing TestResults folder..."
    rm -rf "TestResults"
    echo "TestResults folder removed."
else
    echo "TestResults folder does not exist."
fi
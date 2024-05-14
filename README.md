# Installing dependencies
## For Backend
1. Install .NET 8.0 SDK from https://dotnet.microsoft.com/en-us/download
2. Install Entity Framework Core Tools by running the following command: `dotnet tool install --global dotnet-ef`

## For Frontend
To set up the frontend environment, you will need Node.js and npm installed. You can download them from https://nodejs.org/en/download.
After installing Node.js, navigate to the "front" directory and run the following commands to install necessary dependencies:
1. Run `npm install` to install all dependencies listed in `package.json`.

## For backend tests
To be able to run the backend tests, you can install the needed dependencies by doing the following:
1. Navigate to "back/Strikkeapp/Strikkeapp.Tests"
2. Run the following command `dotnet tool restore`

# Running the application
Before running the application, make sure that the database has been initialized. This can be done by doing the following:
1. Open a terminal and navigate to the "back/Strikkeapp/Strikkeapp"
2. Run the following command: `dotnet ef database update`

After the database has been initialized, the backend should be run, followed by the frontend.

## Running the backend
1. Open a terminal and navigate to the "back/Strikkeapp/Strikkeapp"
2. Run the following command: `dotnet run`

## Running the frontend
1. Open a new terminal and navigate to the "front"
2. Run the following command: `npm start`


## Default admin user
The application has a default admin user when it is first installed. This user should only be used to give other users admin rights. The defualt user should be deleted or banned after the first admin user is created.

Credentials:
- Username: admin@knithub.no
- Password: KnithubAdminUser!

# Running and viewing the tests
## Frontend tests
Locate the frontend folder. 
Run all the tests by writing  `npm test a` in your terminal. You can also chosse to run some specific tests by writing `npm test {file_name}`

## Backend tests
The test result will open in a new browser window after running the following command:
1. Open a terminal and navigate to the "back/Strikkeapp/Strikkeapp.Tests"
2. Run one of the following commands, based on your OS:
   - Windows (Powershell): `dotnet test --collect:"XPlat Code Coverage"; reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"CoverageReports" -reporttypes:Html; Start CoverageReports\index.html`
    - MacOS or Linux: `dotnet test --collect:"XPlat Code Coverage" && dotnet reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"CoverageReports" -reporttypes:Html && open CoverageReports/index.html`
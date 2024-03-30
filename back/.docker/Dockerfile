
FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /source

COPY . . 

RUN dotnet restore "./Strikkeapp/Strikkeapp/Strikkeapp.csproj" --disable-parallel
RUN dotnet publish "./Strikkeapp/Strikkeapp/Strikkeapp.csproj" -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

COPY --from=build /app ./

EXPOSE 5002

ENTRYPOINT ["dotnet", "Strikkeapp.dll"]

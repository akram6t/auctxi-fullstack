# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["payment-service.csproj", "./"]
RUN dotnet restore "payment-service.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "payment-service.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "payment-service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "payment-service.dll"]

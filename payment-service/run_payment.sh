#!/bin/bash
# Script to run the Payment Microservice (ASP.NET Core)
echo "Starting Payment Microservice on port 5001..."
# cd payment-service
dotnet run --launch-profile "http"

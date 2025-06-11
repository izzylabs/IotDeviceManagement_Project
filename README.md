# IoT Smart Home Device Management

## Project Overview
This project implements a cloud-native microservice architecture for managing IoT smart home devices. It enables device registration, command execution, logging, and automated recovery from failures.

## Features
- Device Registry with device metadata and status tracking.
- Command Processing to send and track device commands.
- Repair and Recovery Service for handling failed commands.
- Asynchronous messaging with queues for microservice communication.
- Logging and monitoring capabilities.
- Caching layer for performance optimization.

## Architecture
- Microservices-based system:
  - Device Registry Service
  - Command Execution Service
  - Repair/Recovery Service
- Database schema designed for devices, commands, executions, and logs.
- Messaging queues for async communication.
- CI/CD pipelines for automated deployment.

## Technologies
- TypeScript & Node.js backend
- SQL Database (TypeORM)
- Azure Cloud (for hosting & services)
- Messaging queue (e.g., Azure Service Bus or RabbitMQ)
- In-memory cache

## Getting Started

### Prerequisites
- Node.js (version x.x.x)
- Database (PostgreSQL/MySQL)
- Messaging Queue Service
- Azure CLI (if deploying on Azure)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/izzylabs/IotDeviceManagement_Project.git

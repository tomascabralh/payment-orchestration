# Payment Orchestration System

A payment orchestration system that manages payment processing across multiple providers, handling fallbacks and metrics tracking.

## Overview

The Payment Orchestration System is a robust solution designed to streamline and optimize payment processing for businesses. It acts as a central hub that intelligently routes payment requests to multiple payment providers, ensuring high availability and optimal success rates.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)
- Git

### Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory with the following variables:
   ```
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=payment_orchestration
   DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/payment_orchestration
   ```

### Running with Docker (Recommended)

1. Build and start the containers:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   or
   docker compose -f docker-compose.dev.yml up
   ```
   The application will be available at `http://localhost:4321`

### Running without Docker

1. Install dependencies:

   ```bash
   npm install
   cd src/astro && npm install
   ```

2. Set up the database:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

3. Start the application:
   ```bash
   cd src/astro && npm run dev
   ```

### Troubleshooting

- If you encounter database connection issues, ensure PostgreSQL is running and the credentials in `.env` are correct
- For Docker-related issues, ensure Docker and Docker Compose are properly installed and running
- If you see module not found errors, try running `npm install` in both the root directory and `src/astro`

## Running Tests

The project uses Jest for testing. To run the tests:

```bash
# Run all tests
npm i
npm test
```

## Architecture

The system follows a clean architecture approach with the following layers:

### Core Domain (`src/core/domain/`)

- `PaymentOrder`: Core entity representing a payment order with its status and transactions
- `PaymentMethodVO`: Value object for payment methods/providers
- `PaymentOrderRepository`: Interface defining payment order persistence operations
- `CountryVO`: Value object for country-specific payment method configurations

### Application Layer (`src/core/application/`)

- `ProcessPaymentOrderUseCase`: Main use case for processing payments with provider fallback logic
- `CreatePaymentOrderUseCase`: Use case for creating new payment orders
- `GetPaymentOrderUseCase`: Use case for retrieving payment order details
- `ListCountryPaymentMethodsUseCase`: Use case for retrieving available payment methods by country
- `services/`: Application services
  - `PaymentMethodService`: Service for managing payment method operations and validations
  - `PaymentMethodRegistry`: Service for registering and managing available payment providers

### Infrastructure Layer (`src/core/infrastructure/`)

- `adapters/`: Directory containing payment gateway adapters
- `repositories/`: Directory containing repository implementations
- `database/`: Database configuration and connection management

### API Layer (`src/core/api/`)

- `controllers/`: API controllers handling HTTP requests and responses

### Presentation Layer (Astro)

- React components for the payment form
- API endpoints for payment processing
- Integration with the core domain

## Implementation Scope

### Implemented Features

1. Payment Processing

   - Multi-provider support with intelligent routing
   - Automatic fallback to next provider on failure
   - Transaction tracking and history
   - Provider metrics collection and analysis
   - Real-time payment status updates
   - Support for multiple currencies
   - Detailed transaction logging

2. Payment Form

   - Dynamic provider selection based on success rates
   - Customer information collection with validation
   - Form validation with real-time feedback
   - Comprehensive error handling and user feedback
   - Responsive design for all devices
   - Support for saved payment methods

3. Testing
   - Unit tests for core domain logic
   - Integration tests for payment processing
   - Component tests for UI elements

### Not Implemented (Future Ideas)

1. Authentication & Authorization

   - User authentication
   - Role-based access control
   - API key management

2. Advanced Features

   - Payment refunds
   - Subscription management
   - Webhook handling
   - Payment notifications

3. Monitoring & Logging

   - Detailed logging system
   - Performance monitoring
   - Error tracking

4. Security

   - PCI compliance
   - Data encryption
   - Rate limiting

5. Additional Providers
   - More payment gateway integrations
   - Cryptocurrency support
   - Local payment methods
  
6. Testing
   - End-to-end testing scenarios
   - Performance testing for high-load scenarios

## Project Structure

```
.
├── src/                      # Source code
│   ├── core/                # Core domain and application logic
│   │   ├── domain/         # Domain entities and value objects
│   │   │   ├── PaymentOrder.ts
│   │   │   ├── PaymentMethodVO.ts
│   │   │   ├── PaymentOrderRepository.ts
│   │   │   └── CountryVO.ts
│   │   ├── application/    # Use cases and services
│   │   │   ├── services/  # Application services
│   │   │   │   ├── PaymentMethodService.ts
│   │   │   │   └── PaymentMethodRegistry.ts
│   │   │   ├── ProcessPaymentOrderUseCase.ts
│   │   │   ├── CreatePaymentOrderUseCase.ts
│   │   │   ├── GetPaymentOrderUseCase.ts
│   │   │   └── ListCountryPaymentMethodsUseCase.ts
│   │   ├── infrastructure/ # Adapters and repositories
│   │   │   ├── adapters/  # Payment gateway adapters
│   │   │   ├── repositories/ # Repository implementations
│   │   │   └── database/  # Database configuration
│   │   ├── api/           # API controllers
│   │   │   └── controllers/
│   │   └── __tests__/     # Core tests
│   │
│   ├── astro/             # Frontend application
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── layouts/   # Page layouts
│   │   │   ├── pages/     # Astro pages
│   │   │   ├── api/       # API endpoints
│   │   │   ├── styles/    # CSS and styling
│   │   │   ├── types/     # TypeScript types
│   │   │   └── __tests__/ # Frontend tests
│   │   ├── astro.config.mjs
│   │   └── package.json
│   │
│   └── mocks/             # Mock data and services
│
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   ├── seed.ts          # Database seed data
│   └── migrations/      # Database migrations
│
├── docker-compose.dev.yml # Development Docker configuration
├── package.json          # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── jest.config.cjs      # Jest test configuration
└── setup.sh            # Project setup script
```

## AI Tools Used

- **ChatGPT** – used for architecture planning, basic tasks and questions, and refactoring suggestions
- **Cursor** – for AI-assisted coding directly within the IDE
- **Gemini** – for app diagrams and architecture questions

# Payment Orchestration System

A payment orchestration system that manages payment processing across multiple providers, handling fallbacks and metrics tracking.

## Setup

1. Clone the repository
2. Run the application using Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up --build
```

The application will be available at `http://localhost:4321`

## Running Tests

The project uses Jest for testing. To run the tests:

```bash
# Run all tests
npm i
npm test
```

## Architecture

The system follows a clean architecture approach with the following layers:

### Core Domain

- `PaymentOrder`: Represents a payment order with its status and transactions
- `PaymentMethodVO`: Value object for payment methods/providers
- `PaymentStatus`: Enum for payment statuses (PENDING, PAID, FAILED)

### Application Layer

- `ProcessPaymentOrderUseCase`: Main use case for processing payments
- `PaymentMethodRegistry`: Service for managing available payment methods
- `PaymentMetricsService`: Service for tracking provider performance

### Infrastructure Layer

- `PaymentGatewayAdapter`: Adapter for payment gateway communication
- `PrismaPaymentMethodRepository`: Repository for payment methods
- `PrismaProviderMetricsRepository`: Repository for provider metrics

### Presentation Layer (Astro)

- React components for the payment form
- API endpoints for payment processing
- Integration with the core domain

## Implementation Scope

### Implemented Features

1. Payment Processing

   - Multi-provider support
   - Automatic fallback to next provider on failure
   - Transaction tracking
   - Provider metrics collection

2. Payment Form

   - Dynamic provider selection
   - Customer information collection
   - Form validation
   - Error handling

3. Testing
   - Unit tests for core domain
   - Integration tests for payment processing
   - Component tests for UI

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

## Project Structure

```
src/
├── core/                 # Core domain and application logic
│   ├── domain/          # Domain entities and value objects
│   ├── application/     # Use cases and services
│   └── infrastructure/  # Adapters and repositories
├── astro/               # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api/        # API endpoints
│   │   └── __tests__/  # Frontend tests
└── __tests__/          # Core tests
```

## AI Tools Used

- **ChatGPT** – used for architecture planning, basic tasks and questions, and refactoring suggestions
- **Cursor** – for AI-assisted coding directly within the IDE
- **Gemini** – for app diagrams and architecture questions

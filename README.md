# ALLDATA UI Test Automation Suite with Playwright

This project is a UI test automation suite built with Playwright, designed to provide robust and maintainable end-to-end testing for ALLDATA web applications.

## Features

- Page Object Model (POM) design pattern
- API integration testing
- Cross-browser testing support (Chrome, Firefox, Safari)
- Docker support for containerized testing
- Parallel test execution
- Detailed HTML reports
- Screenshot and video capture on test failure
- Environment-based configuration
- TypeScript support

## Prerequisites

- Node.js (>= 16.0.0)
- npm or yarn
- Docker (optional, for containerized testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Install browser drivers:
```bash
npm run install:browsers
```

## Configuration

1. Create a `.env` file in the root directory:
```env
BASE_URL=<your-application-url>
TEST_ENV=local # or staging/prod
```

## Project Structure

```
project-root/
├── pom_utils/
│   ├── pages/         # Page Object Model classes
│   │   ├── LoginPage.ts    # Login page functionality
│   │   └── HomePage.ts     # Home page and app navigation
│   ├── api/           # API-related utilities
│   │   └── EstimateAPI.ts  # Estimate API client
│   ├── data-generators/ # Data generation utilities
│   │   └── EstimateDataGenerator.ts # Test data generation
│   └── helpers/       # General helper functions
│       └── BaseHelper.ts   # Common helper methods
├── tests/
│   ├── e2e/          # End-to-end test suites
│   ├── regression/   # Regression test suites
│   ├── smoke/        # Smoke test suites
│   │   └── smoke.spec.ts
│   └── api/          # API test suites
├── config/           # Environment configurations
│   ├── config.base.ts
│   ├── config.dev.ts
│   └── config.staging.ts
├── test-results/     # Test execution artifacts
├── playwright-report/ # HTML test reports
├── global-setup.ts   # Global test setup
├── global-teardown.ts # Global test teardown
├── .env              # Environment variables
├── .gitignore
├── docker-compose.yaml
├── Dockerfile
├── package-lock.json
├── package.json
└── playwright.config.ts
```

## Key Components

### Page Objects

- **LoginPage**: Handles authentication flows
  - Login/logout functionality
  - Token management
  - Welcome popup handling

- **HomePage**: Manages application navigation
  - App switching (ADRP, Collision, Repair)
  - Estimate creation
  - Page state verification

### API Utilities

- **EstimateAPI**: Handles estimate-related API calls
  - Creating new estimates
  - Error handling
  - Response processing

### Helpers

- **BaseHelper**: Common utility functions
  - Safe element interactions
  - Wait conditions
  - Element visibility checks

### Data Generators

- **EstimateDataGenerator**: Generates test data
  - Random estimate data
  - Vehicle information
  - Repair order details

## Running Tests

### Local Execution

Run all tests:
```bash
npm test
```

Run specific test suites:
```bash
npm run test:smoke    # Run smoke tests
npm run test:chrome   # Run in Chrome
npm run test:firefox  # Run in Firefox
npm run test:webkit   # Run in Safari
```

Debug tests:
```bash
npm run test:debug
```

### Docker Execution

1. Build the Docker image:
```bash
docker build -t playwright-tests .
```

2. Run tests in container:
```bash
docker-compose up
```

## Test Reports

- HTML reports are generated in `playwright-report/`
- Test artifacts (screenshots, videos) are saved in `test-results/`
- View the latest report:
```bash
npm run report
```

## Best Practices

1. **Page Objects**
   - Keep locators private and actions public
   - Use meaningful method names
   - Handle waits and verifications within page objects

2. **Test Structure**
   - Use test.describe for logical grouping
   - Include setup and teardown steps
   - Add meaningful assertions

3. **Error Handling**
   - Implement proper error handling in API calls
   - Add screenshots on test failures
   - Include detailed error messages

4. **Configuration**
   - Use environment-specific configs
   - Keep sensitive data in .env
   - Configure timeouts appropriately

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## Troubleshooting

Common issues and solutions:

1. **Browser launch fails**:
   - Ensure browser drivers are installed
   - Check custom browser paths in .env
   - Verify system dependencies

2. **Tests fail in CI but pass locally**:
   - Check for environment-specific configuration
   - Verify CI environment variables
   - Review test stability

## License

ISC
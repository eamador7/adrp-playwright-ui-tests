# Playwright Test Automation for ALLDATA Repair Planner

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

1. Create a `.env` file in the root directory (this file should typically be in `.gitignore` and not committed to version control):
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
│   │   └── CollisionPage.ts # Collision related page functionality
│   │   └── EstimatesPage.ts # Estimates related page functionality
│   │   └── RepairPlannerPage.ts # Repair Planner related page functionality
│   ├── api/           # API-related utilities
│   │   └── EstimateAPI.ts  # Estimate API client
│   │   └── DataWebServicesAPI.ts # Data Web Services API client
│   ├── data-generators/ # Data generation utilities
│   │   └── EstimateDataGenerator.ts # Test data generation
│   └── helpers/       # General helper functions
│       └── BaseHelper.ts   # Common helper methods
├── tests/
│   ├── regression/   # Regression test suites
│   │   └── regression.spec.ts
│   │   └── uiValidation.spec.ts
│   │   └── collision.spec.ts
│   ├── smoke/        # Smoke test suites
│   │   └── smoke.spec.ts
├── config/           # Environment configurations
│   └── config.base.ts # Base configuration
├── test-data/        # Test data files (especially for EMS)
├── playwright-report/ # HTML test reports
├── test-results/     # Traces, screenshots, videos (if configured)
├── .env              # Environment variables
├── .gitignore
├── global-setup.ts   # Global test setup
├── global-teardown.ts # Global test teardown
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
    - **CollisionPage**: Manages interactions and elements on the Collision section/page.
    - **EstimatesPage**: Manages interactions and elements on the Estimates section/page.
    - **RepairPlannerPage**: Manages interactions and elements on the Repair Planner section/page.

### API Utilities

- **EstimateAPI**: Handles estimate-related API calls
  - Creating new estimates
  - Error handling
  - Response processing
    - **DataWebServicesAPI**: Handles interactions with Data Web Services APIs.

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
# Run all tests (across all configured browsers)
npm test 
```

Run specific test suites:
```bash
# Run tests for a specific browser
npm run test:chrome   # Run all tests in Chrome
npm run test:firefox  # Run all tests in Firefox
npm run test:webkit   # Run all tests in Safari

# Run specific test suites (e.g., smoke, regression)
npm run test:smoke:all      # Run smoke tests across all configured browsers
npm run test:regression:all # Run regression tests across all configured browsers

# Run specific test suites in a specific browser
npm run test:smoke:chrome      # Run smoke tests in Chrome
npm run test:smoke:firefox     # Run smoke tests in Firefox
npm run test:smoke:webkit      # Run smoke tests in Webkit
npm run test:regression:chrome # Run regression tests in Chrome
npm run test:regression:firefox # Run regression tests in Firefox
npm run test:regression:webkit # Run regression tests in Webkit
```

Debug tests:
```bash
# Debug tests (opens Playwright Inspector)
npm run test:debug
```

Show HTML Test Report:
```bash
npm run report
```

Install browser drivers (if needed):
```bash
npm run install:browsers
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

- HTML reports are generated in `playwright-report/`.
- Test artifacts such as traces, screenshots, and videos (captured on failure or as configured by test settings) are saved in `test-results/`.
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
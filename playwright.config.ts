import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Determine the base URL based on environment
 */
function getBaseUrl(environment: string): string {
  switch (environment.toLowerCase()) {
    case 'qa':
      return 'https://my-qa.alldata.com';
    case 'staging':
      return 'https://my-beta.alldata.com';
    case 'production':
    case 'prod':
      return 'https://my.alldata.com';
    default:
      return 'https://my-qa.alldata.com'; // Default to QA
  }
}

/**
 * Read environment variables that we support
 */
const environment = process.env.TEST_ENV || 'qa'; // Default to QA if not specified

const config = {
  // Base URL for the application determined by environment
  baseURL: getBaseUrl(environment),
  
  // Test environment (qa, staging, prod)
  environment: environment,
  
  // Whether to run tests in CI mode
  isCI: !!process.env.CI,
  
  // Browser configurations
  browsers: {
    chromium: {
      executablePath: process.env.CHROME_PATH || undefined,
    },
    firefox: {
      executablePath: process.env.FIREFOX_PATH || undefined,
    },
    webkit: {
      executablePath: process.env.WEBKIT_PATH || undefined,
    },
  },
};

export { config };

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Directory containing the test files */
  testDir: './tests',
  
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: config.isCI,
  
  /* Retry on CI only */
  retries: config.isCI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: Math.max(1, require('os').cpus().length - 1),
  
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['junit', {
      outputFile: 'test-results/junit.xml'
    }]
  ],

  /* Global setup/teardown for the test run */
  globalSetup: require.resolve('./tests/global-setup'),
  globalTeardown: require.resolve('./tests/global-teardown'),
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          executablePath: config.browsers.chromium.executablePath,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          executablePath: config.browsers.firefox.executablePath,
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          executablePath: config.browsers.webkit.executablePath,
        },
      },
    },
  ],
  
  /* Configure all test runs */
  use: {
    /* Base URL to use in tests */
    baseURL: config.baseURL,
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Collect screenshot after each test failure */
    screenshot: 'only-on-failure',
    
    /* Record video for failed tests */
    video: 'retain-on-failure',
    
    /* Run tests in headless mode by default */
    headless: true,
    
    /* Maximum time each action can take */
    actionTimeout: 15000,
    
    /* Maximum time to wait for element */
    navigationTimeout: 30000,
  },
});

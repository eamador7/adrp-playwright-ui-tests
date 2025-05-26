import { FullConfig } from '@playwright/test';

/**
 * Global setup function that runs before all tests
 * @param config - Playwright configuration
 */
async function globalSetup(config: FullConfig) {
    // Add any global setup logic here
    // For example:
    // - Set up test data
    // - Initialize test environment
    // - Set up global state
    
    console.log('Starting test run with configuration:', {
        testDir: config.projects[0].testDir,
        workers: config.workers,
        retries: config.projects[0].retries,
    });
}

export default globalSetup; 
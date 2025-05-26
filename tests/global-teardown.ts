import { FullConfig } from '@playwright/test';

/**
 * Global teardown function that runs after all tests
 * @param config - Playwright configuration
 */
async function globalTeardown(config: FullConfig) {
    // Add any global cleanup logic here
    // For example:
    // - Clean up test data
    // - Reset test environment
    // - Clean up global state
    
    console.log('Completed test run with configuration:', {
        testDir: config.projects[0].testDir,
        workers: config.workers,
        retries: config.projects[0].retries,
    });
}

export default globalTeardown; 
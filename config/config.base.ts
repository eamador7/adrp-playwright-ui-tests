/**
 * Base configuration shared across all environments
 */
export const baseConfig = {
    timeout: 30000,
    retries: 2,
    workers: 5,
    viewport: {
        width: 1280,
        height: 720
    },
    browserOptions: {
        chromium: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        firefox: {},
        webkit: {}
    }
}; 
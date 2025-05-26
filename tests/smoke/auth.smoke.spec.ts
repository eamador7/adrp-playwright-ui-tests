import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { constants } from '../../pom_utils/config/constants';

test.describe('Authentication Smoke Tests', () => {
    test.setTimeout(60000);

    test('should handle invalid login attempt', async ({ loginPage }) => {
        test.info().annotations.push({ type: 'skipLogout', description: 'No need to logout' });

        await test.step('Attempt invalid login', async () => {
            await loginPage.loginWithCredentials('invalid_user', 'invalid_pass');
            expect(await loginPage.isLoginErrorVisible(), 'Login error message should be visible').toBe(true);
        });
    });
});

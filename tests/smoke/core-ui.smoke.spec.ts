import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { constants } from '../../pom_utils/config/constants';

test.describe('Core UI Smoke Tests', () => {
    test.setTimeout(60000);

    test('should validate app elements (Login page, home page, Repair Planner)', async ({ 
        loginPage,
        homePage,
        repairPlannerPage 
    }) => {
        // Login page validation
        await test.step('Verify login page elements', async () => {
            await loginPage.verifyLoginPageElements();
        });

        await test.step('Login with ADRP user', async () => {
            await loginPage.login('adrp');
        });

        // Home page validation
        await test.step('Verify home page elements', async () => {
            await homePage.verifyHomePageElements();
        });

        await test.step('Navigate to ADRP app', async () => {
            await homePage.navigateToApp('adrp');
        });

        // Repair Planner validation
        await test.step('Open and verify Help & Feedback menu', async () => {
            await repairPlannerPage.openHelpAndFeedback();
            await repairPlannerPage.verifyHelpMenuElements();
        });

        await test.step('Verify Repair Planner elements', async () => {
            await repairPlannerPage.verifyRepairPlannerElements();
        });

        // App switcher validation
        await test.step('Verify app switcher', async () => {
            await homePage.openAppSwitcher();
            await homePage.verifyAppSwitcherElements();
            // Click app switcher again to close it
            await homePage.openAppSwitcher();
        });

        // Import Document dialog validation
        await test.step('Open and verify Import Document dialog', async () => {
            await repairPlannerPage.openImportDocumentDialog();
            await repairPlannerPage.verifyImportDialogElements();
            await repairPlannerPage.closeImportDialog();
        });

        // Logout 
        await test.step('Logout', async () => {
            await repairPlannerPage.logout();
        });
    });
});

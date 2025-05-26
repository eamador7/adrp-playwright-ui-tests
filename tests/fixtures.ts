import { test as base } from '@playwright/test';
import { LoginPage } from '../pom_utils/pages/LoginPage';
import { HomePage } from '../pom_utils/pages/HomePage';
import { RepairPlannerPage } from '../pom_utils/pages/RepairPlannerPage';
import { EstimateAPI } from '../pom_utils/api/EstimateAPI';
import { DataWebServicesAPI } from '../pom_utils/api/DataWebServicesAPI';
import { EstimatesPage } from '../pom_utils/pages/EstimatesPage';
import { CollisionPage } from '../pom_utils/pages/CollisionPage';

type Pages = {
    loginPage: LoginPage;
    homePage: HomePage;
    estimatesPage: EstimatesPage;
    dataWebServicesAPI: DataWebServicesAPI;
    repairPlannerPage: RepairPlannerPage;
    estimateAPI: EstimateAPI;
    collisionPage: CollisionPage;
};

type AuthFixture = {
    authenticatedPage: any;
    authToken: string;
};

// Extend base test with our fixtures
export const test = base.extend<Pages & AuthFixture>({
    // Default page setup
    page: async ({ page }, use) => {
        // Navigate to application
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await use(page);
    },

    // Page Object fixtures
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    collisionPage: async ({ page }, use) => {
        const collisionPage = new CollisionPage(page);
        await use(collisionPage);
    },
    estimatesPage: async ({ page }, use) => {
        const estimatesPage = new EstimatesPage(page);
        await use(estimatesPage);
    },
    repairPlannerPage: async ({ page }, use) => {
        const repairPlannerPage = new RepairPlannerPage(page);
        await use(repairPlannerPage);
    },
    estimateAPI: async ({}, use) => {
        const estimateAPI = new EstimateAPI();
        await use(estimateAPI);
    },
    dataWebServicesAPI: async ({}, use) => {
        const dataWebServicesAPI = new DataWebServicesAPI();
        await use(dataWebServicesAPI);
    },

    // Authentication fixture
    authenticatedPage: async ({ page, loginPage }, use) => {
        // Navigate to application if not already there
        if (!page.url().includes('/')) {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        }

        // Handle cookie banner if present
        try {
            const cookieBanner = page.locator('[aria-label="Cookie Banner"], .cookie-banner');
            const acceptButton = page.locator('button:has-text("Accept Cookies")');
            if (await cookieBanner.isVisible({ timeout: 5000 })) {
                await acceptButton.click();
            }
        } catch (error) {
            // Continue if no cookie banner
        }

        // Perform login
        await loginPage.login('adrp');
        
        // Make the authenticated page available to the test
        await use(page);
    },

    authToken: async ({ loginPage, page }, use) => {
        // Navigate to application if not already there
        if (!page.url().includes('/')) {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
        }
        //await loginPage.login('adrp');
        const token = await loginPage.getAuthToken();
        await use(token);
    },
});
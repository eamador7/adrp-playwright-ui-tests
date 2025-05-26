import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { constants } from '../../pom_utils/config/constants';

test.describe('Position Statements Collision Regression Tests', () => {
    test.setTimeout(60000); // Moved timeout to describe level

    test('should validate Position Statements in Collision is correct', async ({
        authenticatedPage,
        homePage,
        collisionPage }) => {
            
        await test.step('Navigate to Collision Page', async () => {
            await collisionPage.navigateToCollisionPage();
            expect(await collisionPage.verifyCollisionPageTitle()).toBeTruthy();
        });
        await test.step('Navigate to Position Statements on test vehicle 1 via Collision Reference', async () => {
            await collisionPage.navigateToPositionStatementsVehicle(0);
            await collisionPage.clickCollisionReferenceLink();
            await collisionPage.clickPositionStatementsLink();
            expect(await collisionPage.verifyPositionStatementsTitle()).toBeTruthy(); // verifyPositionStatementsTitle does not return a boolean
        });
        await test.step('Navigate to article from the Position Statements article list (test vehicle 1)', async () => {
            let articleName = await collisionPage.navigateRandomPositionStatementsArticle();
            expect(await collisionPage.getPositionStatementsArticleTitle()).toContain(articleName);
        });
        await test.step('Navigate to Position Statements from vehicle details page (test vehicle 1)', async () => {
            await collisionPage.clickSubheaderYMME();
            await collisionPage.clickPositionStatementsLink();
            expect(await collisionPage.verifyPositionStatementsTitle()).toBeTruthy(); // verifyPositionStatementsTitle does not return a boolean
        });
        await test.step('Navigate to article from the Position Statements article list (test vehicle 1)', async () => {
            let articleName = await collisionPage.navigateRandomPositionStatementsArticle();
            expect(await collisionPage.getPositionStatementsArticleTitle()).toContain(articleName);
        });
        await test.step('Change to test vehicle 2', async () => {
            await collisionPage.clickChangeVehicleButton();
            await collisionPage.navigateToPositionStatementsVehicle(1);
        });
        await test.step('Navigate to Position Statements via Collision Reference (test vehicle 2)', async () => {
            await collisionPage.clickCollisionReferenceLink();
            await collisionPage.clickPositionStatementsLink();
            expect(await collisionPage.verifyPositionStatementsTitle()).toBeTruthy(); // verifyPositionStatementsTitle does not return a boolean
        });
        await test.step('Navigate to article from the Position Statements article list (test vehicle 2)', async () => {
            let articleName = await collisionPage.navigateRandomPositionStatementsArticle();
            expect(await collisionPage.getPositionStatementsArticleTitle()).toContain(articleName);
        });
        await test.step('Navigate to Position Statements from vehicle details page (test vehicle 2)', async () => {
            await collisionPage.clickSubheaderYMME();
            await collisionPage.clickPositionStatementsLink();
            expect(await collisionPage.verifyPositionStatementsTitle()).toBeTruthy(); // verifyPositionStatementsTitle does not return a boolean
        });
        await test.step('Navigate to article from the Position Statements article list (test vehicle 2)', async () => {
            let articleName = await collisionPage.navigateRandomPositionStatementsArticle();
            expect(await collisionPage.getPositionStatementsArticleTitle()).toContain(articleName);
        });
    });

    test('should validate Position Statements open correctly in new tabs', async ({
        authenticatedPage,
        homePage,
        collisionPage }) => {
        await test.step('Navigate to Collision Page', async () => {
            await collisionPage.navigateToCollisionPage();
            expect(await collisionPage.verifyCollisionPageTitle()).toBeTruthy();
        });
        await test.step('Navigate to Position Statements on test vehicle 1 via Collision Reference', async () => {
            await collisionPage.navigateToPositionStatementsVehicle(0);
            await collisionPage.clickCollisionReferenceLink();
            await collisionPage.clickPositionStatementsLink();
            expect(await collisionPage.verifyPositionStatementsTitle()).toBeTruthy(); // verifyPositionStatementsTitle does not return a boolean
        });
        await test.step('Navigate to Article in a new tab and validate is not blank', async () => {
            await collisionPage.navigateToPathWithinNewTab(await collisionPage.getRandomPositionStatementsArticlePath());
            expect(await collisionPage.verifyArticleContentIsNotEmpty()).toBeTruthy();
        })
    });
})
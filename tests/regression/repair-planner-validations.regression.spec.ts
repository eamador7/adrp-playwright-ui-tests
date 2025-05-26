import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { constants } from '../../pom_utils/config/constants';

test.describe('UI Validation Regression Tests', () => {
    test.setTimeout(60000);

    test('should validate no vehicle decoded message (GENCO-306)', async ({ authenticatedPage,
        authToken,
        estimateAPI,
        homePage,
        repairPlannerPage }) => {
        test.info().annotations.push({ type: 'issue', description: 'GENCO-306' });
        
        let estimateId: string; // estimateId is now local to this test
        const expectedStatusCode = 201;
        await test.step('Post estimate', async () => {
            const response = await estimateAPI.postEstimate(authToken);
            expect(response.statusCode, 'Estimate creation status code should match').toBe(expectedStatusCode);
            estimateId = response.estimateId;
            expect(estimateId, 'Estimate ID should be present').toBeTruthy();
        });
        await test.step('Navigate to estimate using URL parameter', async () => {
            await repairPlannerPage.navigateToEstimateWithId(estimateId);
            expect(await repairPlannerPage.isSearchInputVisible(), 'Search input should be visible').toBe(true);
            const searchValue = await repairPlannerPage.getSearchDocumentsValue();
            expect(searchValue, 'Search value should match estimate ID').toEqual(String(estimateId));
        });
        await test.step('Verify Confirm Header', async () => {
            expect(await repairPlannerPage.verifyConfirmVehicleHeaderIsCorrect()).toBeTruthy();
        });
    });

    test('should verify ADAS Quick Reference exists (GENCO-307)', async ({ authenticatedPage,
        authToken,
        estimateAPI,
        homePage,
        repairPlannerPage }) => {
        test.info().annotations.push({ type: 'issue', description: 'GENCO-307' });

        let localEstimateId: string; 
        await test.step('Post estimate for ADAS test', async () => {
            const response = await estimateAPI.postEstimate(authToken);
            expect(response.statusCode, 'Estimate creation status code should match').toBe(201);
            localEstimateId = response.estimateId;
            expect(localEstimateId, 'Estimate ID should be present').toBeTruthy();
        });

        await test.step('Map estimate to vehicle', async () => {
            await estimateAPI.mapEstimateToVehicle(authToken, localEstimateId, constants.TEST_VEHICLE.vehicleId);
        });
        await test.step('Navigate to estimate using URL parameter', async () => {
            await repairPlannerPage.navigateToEstimateWithId(localEstimateId);
            expect(await repairPlannerPage.isSearchInputVisible(), 'Search input should be visible').toBe(true);
            const searchValue = await repairPlannerPage.getSearchDocumentsValue();
            expect(searchValue, 'Search value should match estimate ID').toEqual(String(localEstimateId));
        });
        await test.step('Press Vital Repairs button', async () => {
            await repairPlannerPage.navigateToVitalRepairs();
            expect(await repairPlannerPage.verifyADASQuickReferenceTitleIsVisible()).toBeTruthy();
        });
    });

    test('should verify Library Request form is populated with decoded vehicle (GENCO-309)', async ({ authenticatedPage,
        authToken,
        estimateAPI,
        dataWebServicesAPI,
        homePage,
        repairPlannerPage }) => {
        test.info().annotations.push({ type: 'issue', description: 'GENCO-309' });
        
        let localEstimateId: string;
        await test.step('Post estimate for Library Request test', async () => {
            const response = await estimateAPI.postEstimate(authToken);
            expect(response.statusCode, 'Estimate creation status code should match').toBe(201);
            localEstimateId = response.estimateId;
            expect(localEstimateId, 'Estimate ID should be present').toBeTruthy();
        });

        await test.step('Map estimate to vehicle for Library Request test', async () => {
            await estimateAPI.mapEstimateToVehicle(authToken, localEstimateId, constants.TEST_VEHICLE.vehicleId);
        });
        
        let vehicleDetails;
        await test.step('Navigate to estimate using URL parameter', async () => {
            await repairPlannerPage.navigateToEstimateWithId(localEstimateId);
            expect(await repairPlannerPage.isSearchInputVisible(), 'Search input should be visible').toBe(true);
            const searchValue = await repairPlannerPage.getSearchDocumentsValue();
            expect(searchValue, 'Search value should match estimate ID').toEqual(String(localEstimateId));
        });
        await test.step('Get decoded vehicle YMME details', async () => {
            vehicleDetails = await dataWebServicesAPI.getVehicleDetailsByID(authToken, constants.TEST_VEHICLE.vehicleId);
        });
        await test.step('Verify Library Request form is populated with decoded vehicle', async () => {
            await repairPlannerPage.displayLibraryRequestVehicleForm();
            expect(await repairPlannerPage.verifyLibraryRequestVehicleIsPopulatedCorrectly(vehicleDetails)).toBeTruthy();
        });
    });
});
import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { constants } from '../../pom_utils/config/constants';

test.describe('Estimate Workflows Smoke Tests', () => {
    test.setTimeout(60000);

    test('should successfully create estimate and navigate to ADRP app', async ({ 
        authenticatedPage,
        authToken,
        estimateAPI,
        homePage,
        repairPlannerPage 
    }) => {
        const expectedStatusCode = 201;

        // 1. Post estimate
        let estimateId: string;
        await test.step('Post estimate', async () => {
            const response = await estimateAPI.postEstimate(authToken);
            expect(response.statusCode, 'Estimate creation status code should match').toBe(expectedStatusCode);
            estimateId = response.estimateId;
            expect(estimateId, 'Estimate ID should be present').toBeTruthy();
        });

        // 2. Navigate to ADRP app
        await test.step('Navigate to ADRP app', async () => {
            await homePage.navigateToApp('ADRP');
            expect(await repairPlannerPage.isOnADRPPage(), 'Should be on ADRP home page').toBe(true);
        });

        // 3. Logout
        await test.step('Logout', async () => {
            await repairPlannerPage.logout();
        });
    });

    test('should handle automatic estimate navigation scenario', async ({ 
        authenticatedPage,
        authToken,
        estimateAPI,
        homePage,
        repairPlannerPage 
    }) => {
        const vehicleId = '12345'; // Default vehicle ID that exists in all environments
        
        let estimateId: string;
        let estimateNumber: string;
        await test.step('Create estimate via API', async () => {
            const response = await estimateAPI.postEstimate(authToken);
            estimateId = response.estimateId;
            estimateNumber = response.estimateNumber;
            expect(estimateId, 'Estimate ID should be present').toBeTruthy();
        });
        
        await test.step('Map estimate to vehicle', async () => {
            const mapResponse = await estimateAPI.mapEstimateToVehicle(authToken, estimateId, vehicleId);
            expect(mapResponse.statusCode, 'Mapping should be successful').toBeGreaterThanOrEqual(200);
            expect(mapResponse.statusCode, 'Mapping should be successful').toBeLessThan(300);
        });
        
        await test.step('Navigate to estimate using URL parameter', async () => {
            await repairPlannerPage.navigateToEstimateWithId(estimateId);
            
            // Verify the Estimates page is loaded
            expect(await repairPlannerPage.isSearchInputVisible(), 'Search input should be visible').toBe(true);
            
            // Verify search box is populated with the estimate ID
            const searchValue = await repairPlannerPage.getSearchDocumentsValue();
            expect(searchValue, 'Search value should match estimate ID').toEqual(String(estimateId));
        });
        
        await test.step('Open the estimate from search results', async () => {
            await repairPlannerPage.clickFirstEstimateResult();
            
            // Verify the repair planner header contains the estimate number
            const headerText = await repairPlannerPage.getRepairPlannerHeaderText();
            expect(headerText, 'Header should contain estimate number').toContain(String(estimateNumber));
        });

        // 3. Logout
        await test.step('Logout', async () => {
            await repairPlannerPage.logout();
        });
    });

    test('should manually import an Estimate, map it to a vehicle, then delete it', async ({ 
        authenticatedPage, 
        homePage, 
        repairPlannerPage, 
        estimatesPage 
    }) => {
      let vin;

        // 2. Navigate to ADRP app
        await test.step('Navigate to ADRP app', async () => {
            await homePage.navigateToApp('ADRP');
            expect(await repairPlannerPage.isOnADRPPage(), 'Should be on ADRP home page').toBe(true);
        });

        // 3. Import document
        await test.step('Import new document', async () => {
            await repairPlannerPage.openImportDocumentDialog();
            await estimatesPage.getAndUploadRandomEmsFiles();
            await estimatesPage.selectFirstEstimateFromResults();
            vin = await estimatesPage.getVehicleVIN();
            await estimatesPage.clickImportButton();
            
            // Verify import success
            const importMessage = await estimatesPage.getImportMessage();
            // Verify that the import was successful by checking the success message
            expect(importMessage, 'Import should be successful').toContain(constants.IMPORT_SUCCESS_MESSAGE.text);

        });

        // 5. Verify estimate is displayed in search results
        await test.step('Verify estimate is displayed in search results', async () => {
            // Navigate to the Repair Planner view after successful import
            await estimatesPage.clickContinueToRepairPlannerButton();     

            //Search for the estimate using the VIN
            await repairPlannerPage.searchForEstimate(vin);
            await repairPlannerPage.waitForLoadingSpinnerToDisappear(); 
            await repairPlannerPage.clickFirstEstimateResult();
            const vehicleSelectionHeaderText = await repairPlannerPage.getVehicleSelectionHeaderText();
            expect(vehicleSelectionHeaderText, 'Vehicle selection header text should match').toContain(constants.CONFIRM_VEHICLE_HEADER.text);
            await repairPlannerPage.clickFirstVehicleResult();  
        });

        // 6. Delete the estimate to prevent unintended duplicates
        await test.step('Delete the estimate', async () => {
            await repairPlannerPage.waitForActionsMenuButton();
            await repairPlannerPage.clickActionsMenuButton();
            await repairPlannerPage.clickDeleteEstimateOption();
            const confirmDeleteModalHeaderText = await repairPlannerPage.getConfirmDeleteModalHeaderText();
            expect(confirmDeleteModalHeaderText, 'Confirm delete modal header text should match').toContain(constants.DELETE_ESTIMATE.modalHeader);
            const confirmDeleteModalBodyText = await repairPlannerPage.getConfirmDeleteModalBodyText();
            expect(confirmDeleteModalBodyText, 'Confirm delete modal body text should match').toContain(constants.DELETE_ESTIMATE.modalBody);
            await repairPlannerPage.clickConfirmDeleteEstimateButton();
        });

        // 7. Logout
        await test.step('Logout', async () => {
            await repairPlannerPage.logout();
        });

    });

    test('should validate duplicate estimate upload, then delete it', async ({ 
        authenticatedPage, 
        homePage, 
        repairPlannerPage, 
        estimatesPage 
    }) => {
        let vin;


        // 2. Navigate to ADRP app
        await test.step('Navigate to ADRP app', async () => {
            await homePage.navigateToApp('ADRP');
            expect(await repairPlannerPage.isOnADRPPage(), 'Should be on ADRP home page').toBe(true);
        });
    
        // 3. Import document first time
        await test.step('Import document first time', async () => {
            await repairPlannerPage.openImportDocumentDialog();
           await estimatesPage.getAndUploadRandomEmsFiles();
            await estimatesPage.selectFirstEstimateFromResults();
            await estimatesPage.clickImportButton();
            vin = await estimatesPage.getVehicleVIN();
            
            // Verify import success
            const importMessage = await estimatesPage.getImportMessage();
            expect(importMessage, 'Import should be successful').toContain(constants.IMPORT_SUCCESS_MESSAGE.text);
    
            // Return to import more documents
            await estimatesPage.clickImportMoreDocumentsButton();
        });
        
        // 4. Try to import the same document again
        await test.step('Attempt duplicate import, then deny the import', async () => {
            await estimatesPage.selectFirstEstimateFromResults();
            await estimatesPage.clickImportButton();
            await estimatesPage.duplicateButtonsAreVisible();
            // Verify duplicate detection message
            const duplicateMessage = await estimatesPage.getDuplicateFilesMessage();
            const duplicateFilesAlert = await estimatesPage.getDuplicateAlertText();
            expect(duplicateMessage, 'Duplicate detection message should appear').toContain(constants.DUPLICATE_FILES.message);
            expect(duplicateFilesAlert, 'Duplicate files alert should be visible').toContain(constants.DUPLICATE_FILES.alertText);
            
            //Opt for do not upload
            await estimatesPage.clickDoNotUploadButton();
            const notImportedMessage = await estimatesPage.getImportMessage();
            expect(notImportedMessage, 'Import manually denied successfully').toContain(constants.IMPORT_DENIED_MESSAGE.text);
    
            // Return to import more documents
            await estimatesPage.clickImportMoreDocumentsButton();

        });

            // 5. Try to import the same document again
        await test.step('Attempt duplicate import again, confirm the replace option', async () => {
                await estimatesPage.selectFirstEstimateFromResults();
                await estimatesPage.clickImportButton();
                await estimatesPage.duplicateButtonsAreVisible();
                // Verify duplicate detection message
                const duplicateMessage = await estimatesPage.getDuplicateFilesMessage();
                const duplicateFilesAlert = await estimatesPage.getDuplicateAlertText();
                expect(duplicateMessage, 'Duplicate detection message should appear').toContain(constants.DUPLICATE_FILES.message);
                expect(duplicateFilesAlert, 'Duplicate files alert should be visible').toContain(constants.DUPLICATE_FILES.alertText);
                
                //Opt for replace
                await estimatesPage.clickReplaceButton();
                const replacedMessage = await estimatesPage.getImportMessage();
                expect(replacedMessage, 'Import should be successful').toContain(constants.IMPORT_SUCCESS_MESSAGE.text);
        
                // Return to import more documents
                
         });

           // 6. Verify estimate is displayed in search results
        await test.step('Verify estimate is displayed in search results', async () => {
            // Navigate to the Repair Planner view after successful import
            await estimatesPage.clickContinueToRepairPlannerButton();     

            //Search for the estimate using the VIN
            await repairPlannerPage.searchForEstimate(vin);
            await repairPlannerPage.waitForLoadingSpinnerToDisappear(); 
            await repairPlannerPage.clickFirstEstimateResult();
            const vehicleSelectionHeaderText = await repairPlannerPage.getVehicleSelectionHeaderText();
            expect(vehicleSelectionHeaderText, 'Vehicle selection header text should match').toContain(constants.CONFIRM_VEHICLE_HEADER.text);
            await repairPlannerPage.clickFirstVehicleResult();  
        });

        // 7. Delete the estimate to prevent unintended duplicates
        await test.step('Delete the estimate', async () => {
            await repairPlannerPage.waitForActionsMenuButton();
            await repairPlannerPage.clickActionsMenuButton();
            await repairPlannerPage.clickDeleteEstimateOption();
            const confirmDeleteModalHeaderText = await repairPlannerPage.getConfirmDeleteModalHeaderText();
            expect(confirmDeleteModalHeaderText, 'Confirm delete modal header text should match').toContain(constants.DELETE_ESTIMATE.modalHeader);
            const confirmDeleteModalBodyText = await repairPlannerPage.getConfirmDeleteModalBodyText();
            expect(confirmDeleteModalBodyText, 'Confirm delete modal body text should match').toContain(constants.DELETE_ESTIMATE.modalBody);
            await repairPlannerPage.clickConfirmDeleteEstimateButton();
        });

        // 6. Logout
        await test.step('Logout', async () => {
            await repairPlannerPage.logout();
        });
    });
});

import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "../helpers/BaseHelper";

/**
 * Page object for handling estimates page functionality
 * Note: Methods have been moved to RepairPlannerPage
 * This class is kept as a placeholder for future estimate-specific functionality
 */
export class EstimatesPage extends BaseHelper {
    // #region Locators
    private readonly browseButton: Locator;
    private readonly importSuccessMessage: Locator;
    private readonly continueToRepairPlannerButton: Locator;
    private readonly importMoreDocumentsButton: Locator;
    private readonly importButton: Locator;
    private readonly importDocumentInput: Locator;
    private readonly duplicateFilesMessage: Locator;
    private readonly duplicateFilesAlert: Locator;
    private readonly replaceButton: Locator;
    private readonly doNotUploadButton: Locator;
    private readonly vehicleInformationVIN: Locator;

    // #endregion

    constructor(page: Page) {
        super(page);
        // Initialize locators when needed
        this.browseButton = this.page.getByText('Browse');
        this.importSuccessMessage = this.page.locator('div#success-block > p > span');
        this.continueToRepairPlannerButton = this.page.getByRole('button', { name: 'Continue to Repair Planner' });
        this.importMoreDocumentsButton = this.page.getByRole('button', { name: 'Import More Documents' });
        this.importButton = this.page.getByRole('button', { name: 'Import ' });
        this.importDocumentInput =  this.page.locator('#file-upload-file-directory');
        this.duplicateFilesMessage = this.page.locator('#duplicate-files > p');
        this.duplicateFilesAlert = this.page.getByText('Duplicate Files Detected.'); 
        this.replaceButton = this.page.getByRole('button', { name: 'Replace' });
        this.doNotUploadButton = this.page.getByRole('button', { name: 'Do Not Upload' });
        this.vehicleInformationVIN = this.page.locator('span[title="Vehicle/VIN"] a' )

    }

    // Methods will be added here in the future

    /**
 * Clicks the Browse button in the import dialog
 */
async clickBrowseButton(): Promise<void> {
    await this.browseButton.click();
}

/**
 * Gets random files from test-data/ems directory and uploads them
 * This combines the previous getRandomEmsFolderPath and uploadFiles methods
 */
async getAndUploadRandomEmsFiles(): Promise<void> {
    const fs = require('fs');
    const path = require('path');
    const emsPath = path.join(process.cwd(), 'test-data', 'ems');
    
    // Get all folders in the ems directory
    const folders = fs.readdirSync(emsPath).filter(
        item => fs.statSync(path.join(emsPath, item)).isDirectory()
    );
    
    if (folders.length === 0) {
        throw new Error('No folders found in test-data/ems directory');
    }
    
    // Select a random folder
    const randomIndex = Math.floor(Math.random() * folders.length);
    const randomFolder = folders[randomIndex];
    const folderPath = path.join(process.cwd(), 'test-data', 'ems', randomFolder);
    

    // Upload the files
    await this.importDocumentInput.setInputFiles(folderPath);
}



/**
 * Selects the first estimate from the results list
 */
async selectFirstEstimateFromResults(): Promise<void> {
    // This is a more generic selector that doesn't rely on specific vehicle details
    await this.page.getByRole('row').first().locator('div').nth(2).click();
}

/**
 * Clicks the Import button
 */
async clickImportButton(): Promise<void> {
    await this.importButton.click();
}

/**
 * Clicks the Continue to Repair Planner button
 */
async clickContinueToRepairPlannerButton(): Promise<void> {
    await this.continueToRepairPlannerButton.click();
}

/**
 * Clicks the Import More Documents button
 */
async clickImportMoreDocumentsButton(): Promise<void> {
    await this.importMoreDocumentsButton.click();
}

/**
 * Clicks the Do Not Upload button
 */
async clickDoNotUploadButton(): Promise<void> {
    await this.doNotUploadButton.click();
}

/**
 * Clicks the Replace button
 */
async clickReplaceButton(): Promise<void> {
    await this.replaceButton.click();
}

/**
 * Gets the text content of the import success message
 * @returns The text content of the import success message
 */
async getImportMessage(): Promise<string> {
    return await this.getElementText(this.importSuccessMessage);
}

/**
 * Gets the text content of the duplicate files alert
 * @returns The text content of the duplicate files alert
 */
async getDuplicateAlertText(): Promise<string> {
    return await this.getElementText(this.duplicateFilesAlert);
}

/**
 * Gets the VIN of the vehicle from the vehicle information
 * @returns The VIN of the vehicle
 */
async getVehicleVIN(): Promise<string> {
    return await this.getElementText(this.vehicleInformationVIN);
}


/**
 * Gets the text content of the duplicate files message
 * @returns The text content of the duplicate files message
 */
async getDuplicateFilesMessage(): Promise<string> {
    return await this.getElementText(this.duplicateFilesMessage);
}


/**
 * Asserts that the Do Not Upload button and the Replace button are visible
 */
async duplicateButtonsAreVisible(): Promise<boolean> {
    return await this.isElementVisible(this.doNotUploadButton) && await this.isElementVisible(this.replaceButton);
}
    

}

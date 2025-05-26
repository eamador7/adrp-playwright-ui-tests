import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "../helpers/BaseHelper";
import { constants } from '../../pom_utils/config/constants';

/**
 * Page object for handling repair planner functionality
 */
export class RepairPlannerPage extends BaseHelper {
    // #region Locators
    private readonly documentsNavItem: Locator;
    private readonly settingsNavItem: Locator;
    private readonly hideText: Locator;
    private readonly profileButton: Locator;
    private readonly logoutButton: Locator;
    private readonly repairPlannerHeaderText: Locator;
    private readonly importNewDocumentButton: Locator;
    private readonly uploadedDateText: Locator;
    private readonly filterSortText: Locator;
    private readonly searchDocumentsInput: Locator;
    private readonly helpFeedbackButton: Locator;
    private readonly helpMenu: Locator;
    private readonly inProductGuidanceText: Locator;
    private readonly supportTrainingText: Locator;
    private readonly contactAllDataText: Locator;
    private readonly techAssistText: Locator;
    private readonly shopOperationsText: Locator;
    private readonly techReferenceRepairText: Locator;
    private readonly techReferenceCollisionText: Locator;
    private readonly productFeedbackText: Locator;
    private readonly termsOfUseText: Locator;
    private readonly privacyStatementText: Locator;
    private readonly importDocumentDialog: Locator;
    private readonly importDialogCloseButton: Locator;
    private readonly uploadDocListText: Locator;
    private readonly selectDefaultFolderText: Locator;
    private readonly browseButton: Locator;
    private readonly folderTextbox: Locator;
    private readonly estimateResultsList: Locator;
    private readonly repairPlannerHeader: Locator;
    private readonly firstVehicleResult: Locator;
    private readonly vehicleSelectionHeader: Locator;
    private readonly actionsMenuButton: Locator;
    private readonly deleteEstimateOption: Locator;
    private readonly confirmDeleteModalHeader: Locator;
    private readonly confirmDeleteModalBody: Locator;
    private readonly confirmDeleteEstimateButton: Locator;
    private readonly loadingSpinner: Locator;
    private readonly confirmVehicleHeader: Locator;
    private readonly vitalRepairsButton: Locator;
    private readonly libraryRequestButton: Locator;
    // #endregion

    constructor(page: Page) {
        super(page);

        // Initialize navigation and menu locators
        this.documentsNavItem = this.page.locator('#navItem-1');
        this.settingsNavItem = this.page.locator('#navItem-2');
        this.hideText = this.page.locator('ad-uib-side-nav-bar').getByText('HIDE');
        this.profileButton = this.page.locator('a').first();
        this.logoutButton = this.page.getByText('Logout');
        this.repairPlannerHeaderText = this.page.locator('#app-header');
        this.importNewDocumentButton = this.page.getByRole('button', { name: 'Import New Document' });
        this.uploadedDateText = this.page.locator('#pn_id_1_header_action').getByText('Uploaded Date');
        this.filterSortText = this.page.locator('#pn_id_1_header_action').getByText('Filter & Sort');
        this.searchDocumentsInput = this.page.getByRole('searchbox', { name: 'Search Documents' });
        this.helpFeedbackButton = this.page.locator('#qualtricsFeedback');
        this.helpMenu = this.page.getByRole('list');
        this.inProductGuidanceText = this.helpMenu.getByText('In-Product Guidance');
        this.supportTrainingText = this.helpMenu.getByText('Support & Training');
        this.contactAllDataText = this.helpMenu.getByText('Contact ALLDATA');
        this.techAssistText = this.helpMenu.getByText('Tech Assist');
        this.shopOperationsText = this.helpMenu.getByText('Shop Operations');
        this.techReferenceRepairText = this.helpMenu.getByText('Tech Reference - Repair');
        this.techReferenceCollisionText = this.helpMenu.getByText('Tech Reference - Collision');
        this.productFeedbackText = this.page.locator('#qsFeedback');
        this.termsOfUseText = this.page.getByRole('dialog').getByText('Terms of Use');
        this.privacyStatementText = this.page.getByRole('dialog').getByText('Privacy Statement');
        this.importDocumentDialog = this.page.locator('ad-uib-dialog-header');
        this.importDialogCloseButton = this.importDocumentDialog.getByText('Close');
        this.uploadDocListText = this.page.getByRole('paragraph').getByText('Upload Document List');
        this.selectDefaultFolderText = this.page.locator('ad-uib-file-upload').getByText('Select Default Document Folder');
        this.browseButton = this.page.locator('ad-uib-file-upload').getByText('Browse');
        this.folderTextbox = this.page.getByRole('textbox', { name: 'Browse for folder to import' });
        this.estimateResultsList = this.page.locator('.estimator-list');
        this.repairPlannerHeader = this.page.locator('ad-repair-planner-header').getByText('#');
        this.firstVehicleResult = this.page.locator('ad-common-vehicle-block div').first();
        this.vehicleSelectionHeader = this.page.locator('ad-repair-planner-select-vehicle div div span.primary-header');
        this.actionsMenuButton = this.page.locator('a').filter({ hasText: 'Actions' })
        this.deleteEstimateOption = this.page.getByText('Delete');
        this.confirmDeleteModalHeader = this.page.locator('div.message-main');
        this.confirmDeleteModalBody = this.page.locator('div.message-sub')
        this.confirmDeleteEstimateButton = this.page.getByRole('button', { name: 'Delete' });
        this.loadingSpinner = this.page.locator('ad-uib-progress-spinner');
        this.confirmVehicleHeader = this.page.locator('ad-repair-planner-select-vehicle span.primary-header');
        this.vitalRepairsButton = this.page.locator('#btnActionSelector');
        this.libraryRequestButton = this.page.locator('.library-request-button');
    }

    // #region Page Verification Methods

    /**
     * Checks if user is on the Repair Planner page
     * @returns Promise<boolean> indicating if on Repair Planner page
     */
    async isOnADRPPage(): Promise<boolean> {
        return await this.isElementVisible(this.importNewDocumentButton, { timeout: 10000 })
    }

    /**
     * Verifies Repair Planner page elements
     */
    async verifyRepairPlannerElements(): Promise<void> {
        await this.isElementVisible(this.repairPlannerHeaderText);
        await this.isElementVisible(this.importNewDocumentButton);
        await this.isElementVisible(this.uploadedDateText);
        await this.isElementVisible(this.filterSortText);
        await this.isElementVisible(this.documentsNavItem);
        await this.isElementVisible(this.settingsNavItem);
        await this.isElementVisible(this.hideText);
    }

    // #endregion

    // #region User Profile Methods

    /**
     * Opens the profile menu in Repair Planner page
     */
    async openProfileMenu(): Promise<void> {
        await this.safeClick(this.profileButton);
        await this.waitForNumberOfSeconds(0.5);
    }

    /**
     * Logs out from the Repair Planner page
     */
    async logout(): Promise<void> {
        await this.openProfileMenu();
        await this.safeClick(this.logoutButton);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // #endregion

    // #region Help and Feedback Methods

    /**
     * Opens Help & Feedback menu
     */
    async openHelpAndFeedback(): Promise<void> {
        await this.safeClick(this.helpFeedbackButton);
    }

    /**
     * Verifies Help & Feedback menu elements
     */
    async verifyHelpMenuElements(): Promise<void> {
        await this.isElementVisible(this.inProductGuidanceText);
        await this.isElementVisible(this.supportTrainingText);
        await this.isElementVisible(this.contactAllDataText);
        await this.isElementVisible(this.techAssistText);
        await this.isElementVisible(this.shopOperationsText);
        await this.isElementVisible(this.techReferenceRepairText);
        await this.isElementVisible(this.techReferenceCollisionText);
        await this.isElementVisible(this.productFeedbackText);
        await this.isElementVisible(this.termsOfUseText);
        await this.isElementVisible(this.privacyStatementText);
    }

    // #endregion

    // #region Import Document Methods

    /**
     * Opens Import Document dialog
     */
    async openImportDocumentDialog(): Promise<void> {
        await this.safeClick(this.importNewDocumentButton);
    }

    /**
     * Verifies Import Document dialog elements
     */
    async verifyImportDialogElements(): Promise<void> {
        await this.isElementVisible(this.importDocumentDialog);
        await this.isElementVisible(this.importDialogCloseButton);
        await this.isElementVisible(this.uploadDocListText);
        await this.isElementVisible(this.selectDefaultFolderText);
        await this.isElementVisible(this.browseButton);
        await this.isElementVisible(this.folderTextbox);
        await this.isElementVisible(this.searchDocumentsInput);
    }

    /**
     * Closes Import Document dialog
     */
    async closeImportDialog(): Promise<void> {
        await this.safeClick(this.importDialogCloseButton);
    }

    // #endregion

    // #region Estimates Methods (moved from EstimatesPage)

    /**
     * Navigates to the estimates page with an estimate ID
     * @param estimateId - ID of the estimate to navigate to
     */
    async navigateToEstimateWithId(estimateId: string): Promise<void> {
        await this.page.goto(`/repair-planner/#/home?estimateID=${estimateId}`, { waitUntil: 'domcontentloaded' });
        await this.waitForNumberOfSeconds(1);
    }

    /**
     * Gets the value from the search documents input
     */
    async getSearchDocumentsValue(): Promise<string> {
        return await this.searchDocumentsInput.inputValue();
    }

    /**
     * Searches for an estimate by VIN
     * @param vin - VIN to search for
     */
    async searchForEstimate(vin: string): Promise<void> {
        await this.searchDocumentsInput.click({ force: true });
        await this.searchDocumentsInput.fill(vin);
        await this.searchDocumentsInput.press('Enter');
        await this.waitForNumberOfSeconds(1);

    }

    /**
     * Clicks on an estimate result by its description text
     * @param descriptionText - Text to identify the estimate
     */
    async clickEstimateByText(descriptionText: string): Promise<void> {
        await this.page.getByText(descriptionText).click();
    }

    /**
     * Clicks on the first estimate in the results list
     */
    async clickFirstEstimateResult(): Promise<void> {
        await this.safeClick(this.estimateResultsList.first());
    }

    /**
     * Clicks on the first vehicle result
     */
    async clickFirstVehicleResult(): Promise<void> {
        await this.safeClick(this.firstVehicleResult);
    }

    /**
     * Clicks on the actions menu button
     */
    async clickActionsMenuButton(): Promise<void> {
        await this.safeClick(this.actionsMenuButton);
    }

    /**
         * Waits for the actions menu button to be visible and enabled
         */
    async waitForActionsMenuButton(): Promise<void> {
        await this.isElementVisible(this.actionsMenuButton, { timeout: 20000 })
    }


    /**
     * Gets the text content of the repair planner header
     */
    async getRepairPlannerHeaderText(): Promise<string> {
        return await this.getElementText(this.repairPlannerHeader);
    }

    /**
     * Gets the text content of the vehicle selection header
     */
    async getVehicleSelectionHeaderText(): Promise<string> {
        return await this.getElementText(this.vehicleSelectionHeader);
    }

    /**
     * Clicks on the delete estimate option
     */
    async clickDeleteEstimateOption(): Promise<void> {
        await this.safeClick(this.deleteEstimateOption);
    }

    /**
     * Gets the text content of the confirm delete modal header
     */
    async getConfirmDeleteModalHeaderText(): Promise<string> {
        return await this.getElementText(this.confirmDeleteModalHeader);
    }

    /**
     * Gets the text content of the confirm delete modal body
     */
    async getConfirmDeleteModalBodyText(): Promise<string> {
        return await this.getElementText(this.confirmDeleteModalBody);
    }

    /**
     * Clicks on the confirm delete estimate button
     */
    async clickConfirmDeleteEstimateButton(): Promise<void> {
        await this.safeClick(this.confirmDeleteEstimateButton);
    }

    /**
     * Checks if search input is visible
     */
    async isSearchInputVisible(): Promise<boolean> {
        return await this.isElementVisible(this.searchDocumentsInput);
    }

    // Add these new methods:
    /**
     * Waits for the loading spinner to appear
     */
    async waitForLoadingSpinnerToAppear(): Promise<void> {
        await this.isElementVisible(this.loadingSpinner);
    }

    /**
     * Waits for the loading spinner to disappear
     */
    async waitForLoadingSpinnerToDisappear(): Promise<void> {
        await this.isElementHidden(this.loadingSpinner);
    }

    /**
     * Checks if loading spinner is currently visible
     * @returns Promise<boolean> indicating if spinner is visible
     */
    async isLoadingSpinnerVisible(): Promise<boolean> {
        return await this.isElementVisible(this.loadingSpinner);
    }

    // #endregion

    // #region Regression - UI Validations

    /**
     * Verifies the confirm vehicle header is correct in text and font
    */
    async verifyConfirmVehicleHeaderIsCorrect(): Promise<boolean> {
        return await this.confirmVehicleHeader.textContent() == constants.CONFIRM_VEHICLE_HEADER.text
            && (await this.getElementCSSPropertyValue(this.confirmVehicleHeader, 'fontFamily')).includes(constants.CONFIRM_VEHICLE_HEADER.font)
            && await this.getElementCSSPropertyValue(this.confirmVehicleHeader, 'fontSize') == constants.CONFIRM_VEHICLE_HEADER.fontSize;
    }

    /**
     * Clicks the vital repairs button and selects the ADAS Quick Reference option
     */
    async navigateToVitalRepairs(): Promise<void> {
        await this.safeClick(this.vitalRepairsButton);
        await this.safeClick(this.page.getByText(constants.ADAS_QUICK_REFERENCE.optionText));
    }

    /**
     * Navigates to the Collision frame and verifies the ADAS Quick Reference title is visible
     * @returns boolean indicating if ADAS Quick Reference title is visible
     */
    async verifyADASQuickReferenceTitleIsVisible(): Promise<boolean> {
        const collisionFrame = await this.page.frameLocator('iframe#iframe');
        await this.waitForNumberOfSeconds(4);
        const titleLocator = await collisionFrame.locator('h3.repair-page-title');
        return await titleLocator.isVisible() && await titleLocator.textContent() == constants.ADAS_QUICK_REFERENCE.headerText;
    }

    /**
     * Clicks the Library Request button and clicks 'Back' to display Vehicle details form
     */
    async displayLibraryRequestVehicleForm(): Promise<void> {
        await this.safeClick(this.libraryRequestButton);
        await this.waitForNumberOfSeconds(1);
        await this.safeClick(this.page.locator('.library-request-footer ad-uib-button.btn-back button'));
    }

    /**
     * 
     * @param vehicleDetails DWS API response vehicle object
     * @returns boolean indicating if the Library Request form is populated with the given vehicle details
     */
    async verifyLibraryRequestVehicleIsPopulatedCorrectly(vehicleDetails: Promise<{ statusCode: number, body: any }>): Promise<boolean> {
        return await this.page.locator('#year').inputValue() == (await vehicleDetails).body.year &&
            await this.page.locator('#make').inputValue() == (await vehicleDetails).body.make &&
            await this.page.locator('#model').inputValue() == (await vehicleDetails).body.model &&
            await this.page.locator('#engine').inputValue() == (await vehicleDetails).body.engine;
    }

    // #endregion
}
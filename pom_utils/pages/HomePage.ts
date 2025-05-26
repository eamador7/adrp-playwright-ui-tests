import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "../helpers/BaseHelper";

/**
 * Page object for handling home page functionality
 */
export class HomePage extends BaseHelper {
    // #region Locators
    
    // App navigation locators
    private readonly adrpApp: Locator;
    private readonly collisionApp: Locator;
    private readonly repairApp: Locator;
    private readonly appSwitcherIcon: Locator;
    private readonly productRepairPlannerText: Locator;
    private readonly productCollisionText: Locator;
    
    // User profile locators
    private readonly profileButton: Locator;
    private readonly logoutButton: Locator;
    private readonly welcomeText: Locator;
    
    // Contact information locators
    private readonly contactAllDataText: Locator;
    private readonly phoneNumberText: Locator;
    private readonly emailText: Locator;
    
    // #endregion

    constructor(page: Page) {
        super(page);
        
        // Initialize app navigation locators
        this.adrpApp = this.page.getByText('ALLDATA REPAIR PLANNER').nth(1);
        this.collisionApp = this.page.getByText('COLLISION').nth(2);
        this.repairApp = this.page.getByText('REPAIR').nth(3);
        this.appSwitcherIcon = this.page.locator('.app-icon-app-switcher');
        this.productRepairPlannerText = this.page.locator('#product-repair-planner');
        this.productCollisionText = this.page.locator('#product-collision');
        
        // Initialize user profile locators
        this.welcomeText = this.page.getByText('Welcome, Aca');
        this.profileButton = this.page.locator('#top-menu-0 > i');
        this.logoutButton = this.page.locator('#top-menu-0').getByText('Logout');   
        
        // Initialize contact information locators
        this.contactAllDataText = this.page.getByText('Contact ALLDATA');
        this.phoneNumberText = this.page.getByText('800-859-3282');
        this.emailText = this.page.getByText('Email');
    }

    // #region Navigation Methods
    
    /**
     * Navigates to a specific app
     * @param appName - Name of the app to navigate to (case-insensitive)
     */
    async navigateToApp(appName: string): Promise<void> {
        const normalizedAppName = appName.toLowerCase();
        switch (normalizedAppName) {
            case 'adrp':
                await this.safeClick(this.adrpApp);
                break;
            case 'collision':
                await this.safeClick(this.collisionApp);
                break;
            case 'repair':
                await this.safeClick(this.repairApp);
                break;
            default:
                throw new Error(`Unsupported app type: ${appName}`);
        }
        
        await this.page.waitForLoadState('domcontentloaded');
        await this.waitForNumberOfSeconds(2); // Additional wait for app to fully load
    }

    /**
     * Opens the app switcher menu
     */
    async openAppSwitcher(): Promise<void> {
        await this.safeClick(this.appSwitcherIcon);
    }
    
    // #endregion

    // #region User Profile Methods
    
    /**
     * Opens the profile menu on Home page
     */
    async openProfileMenu(): Promise<void> {
        await this.safeClick(this.profileButton);
        await this.waitForNumberOfSeconds(0.5);
    }

    /**
     * Logs out from the Home page
     */
    async logout(): Promise<void> {
        await this.openProfileMenu();
        await this.safeClick(this.logoutButton);
        await this.page.waitForLoadState('domcontentloaded');
    }


    
    // #endregion

    // #region Verification Methods
    
    /**
     * Verifies app switcher elements
     */
    async verifyAppSwitcherElements(): Promise<void> {
        await this.isElementVisible(this.productRepairPlannerText);
        await this.isElementVisible(this.productCollisionText);
    }

    /**
     * Verifies home page elements are present
     */
    async verifyHomePageElements(): Promise<void> {
        await this.isElementVisible(this.welcomeText);
        await this.isElementVisible(this.contactAllDataText);
        await this.isElementVisible(this.phoneNumberText);
        await this.isElementVisible(this.emailText);
        await this.isElementVisible(this.adrpApp);
        await this.isElementVisible(this.collisionApp);
    }
    
    // #endregion
}
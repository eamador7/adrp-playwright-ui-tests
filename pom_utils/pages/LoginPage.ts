import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "../helpers/BaseHelper";
import { credentials } from "../config/credentials";

interface UserCredentials {
    username: string;
    password: string;
}

/**
 * Page object for handling login functionality
 */
export class LoginPage extends BaseHelper {
    // #region Locators
    
    // Login form locators
    private readonly loginForm: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeader: Locator;
    private readonly rememberMeText: Locator;
    private readonly passwordResetText: Locator;
    private readonly loginErrorMessage: Locator;
    
    // Terms and privacy locators
    private readonly termsText: Locator;
    private readonly cookieSettingsButton: Locator;
    private readonly privacyStatementText: Locator;
    
    // Navigation menu locators
    private readonly helpSupportMenu: Locator;
    private readonly notCustomerMenu: Locator;
    
    // Welcome popup locators
    private readonly popupModal: Locator;
    private readonly doNotShowCheckbox: Locator;
    private readonly closePopupButton: Locator;
    
    // #endregion

    constructor(page: Page) {
        super(page);
        
        // Initialize login form locators
        this.loginForm = this.page.getByRole('form');
        this.usernameInput = this.page.getByRole('textbox', { name: "Username" });
        this.passwordInput = this.page.getByRole('textbox', { name: "Password" });
        this.loginButton = this.page.getByRole('button', { name: "Log In" });
        this.loginHeader = this.page.getByRole('heading', { name: 'Login' });
        this.rememberMeText = this.loginForm.getByText('Remember me');
        this.passwordResetText = this.loginForm.getByText('Password Reset');
        this.loginErrorMessage = this.page.getByText('Invalid Login Attempt');
        
        // Initialize terms and privacy locators
        this.termsText = this.loginForm.getByText('By signing in to ALLDATA, you agree to our Terms and Conditions of Use');
        this.cookieSettingsButton = this.page.locator('#ot-sdk-btn');
        this.privacyStatementText = this.loginForm.getByText('Privacy Statement');
        
        // Initialize navigation menu locators
        this.helpSupportMenu = this.page.locator('#top-menu-0');
        this.notCustomerMenu = this.page.locator('#top-menu-2');
        
        // Initialize welcome popup locators
        this.popupModal = this.page.locator('.modal-content');
        this.doNotShowCheckbox = this.page.locator('input#doNotShow');
        this.closePopupButton = this.page.locator('.appIcon-close');
    }

    // #region Authentication Methods
    
    /**
     * Logs in with predefined user credentials
     * @param userType - Type of user to login as
     * @throws Error if user type is not recognized
     */
    async login(userType: string): Promise<void> {
        const userCredentials = this.getUserCredentials(userType);
        await this.loginWithCredentials(userCredentials.username, userCredentials.password);
    }

    /**
     * Logs in with custom credentials
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async loginWithCredentials(username: string, password: string): Promise<void> {
        await this.safeFill(this.usernameInput, username);
        await this.safeFill(this.passwordInput, password);
        await this.safeClick(this.loginButton);
        await this.handleWelcomePopup();
    }

    /**
     * Gets authentication token from cookies
     * @returns Promise<string> The authentication token
     * @throws Error if token is not found
     */
    async getAuthToken(): Promise<string> {
        const context = this.page.context();
        const cookies = await context.cookies();
        const tokenCookie = cookies.find(cookie => cookie.name === 'Access-Token');
        
        if (!tokenCookie) {
            throw new Error('Authentication token not found in cookies');
        }

        return tokenCookie.value;
    }
    
    // #endregion

    // #region Verification Methods
    
    /**
     * Checks if login error message is visible
     * @returns Promise<boolean> indicating if error message is visible
     */
    async isLoginErrorVisible(): Promise<boolean> {
        return await this.isElementVisible(this.loginErrorMessage, { timeout: 2000 });
    }
    
    /**
     * Verifies login page elements are present
     */
    async verifyLoginPageElements(): Promise<void> {
        await this.isElementVisible(this.loginHeader);
        await this.isElementVisible(this.rememberMeText);
        await this.isElementVisible(this.passwordResetText);
        await this.isElementVisible(this.termsText);
        await this.isElementVisible(this.cookieSettingsButton);
        await this.isElementVisible(this.privacyStatementText);
        await this.isElementVisible(this.helpSupportMenu);
        await this.isElementVisible(this.notCustomerMenu);
        await this.isElementVisible(this.loginButton);
    }
    
    // #endregion

    // #region Helper Methods
    
    /**
     * Handles the welcome popup if it appears
     * @private
     */
    private async handleWelcomePopup(): Promise<void> {
        const isPopupVisible = await this.isElementVisible(this.popupModal, { timeout: 5000 });
        
        if (isPopupVisible) {
            await this.safeClick(this.doNotShowCheckbox);
            await this.safeClick(this.closePopupButton);
        }
    }

    /**
     * Gets user credentials based on user type
     * @private
     */
    private getUserCredentials(userType: string): UserCredentials {
        const userCredentials = credentials[userType];
        
        if (!userCredentials) {
            throw new Error(`Unknown user type: ${userType}`);
        }

        return userCredentials;
    }
    
    // #endregion
    }
import { Locator, Page } from "@playwright/test";

/**
 * Base helper class providing common functionality for all page objects
 */
export class BaseHelper {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Waits for a specified number of seconds
     * @param timeInSeconds - Time to wait in seconds
     */
    protected async waitForNumberOfSeconds(timeInSeconds: number): Promise<void> {
        await this.page.waitForTimeout(timeInSeconds * 1000);
    }

    /**
     * Safely clicks an element with retry mechanism
     * @param locator - Playwright locator for the element
     * @param options - Optional click options
     */
    protected async safeClick(locator: Locator, options?: { timeout?: number, force?: boolean }): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 5000 });
        await locator.click({ force: options?.force ?? false });
    }

    /**
     * Safely fills an input field with retry mechanism
     * @param locator - Playwright locator for the input element
     * @param value - Value to fill
     * @param options - Optional fill options
     */
    protected async safeFill(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 5000 });
        await locator.fill(value);
    }

    /**
     * Waits for element to be visible and returns its text content
     * @param locator - Playwright locator for the element
     * @param options - Optional timeout
     */
    protected async getElementText(locator: Locator, options?: { timeout?: number }): Promise<string> {
        await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 5000 });
        return await locator.textContent() || '';
    }

    /**
     * Checks if an element is visible on the page
     * @param locator - Playwright locator for the element
     * @param options - Optional timeout
     */
    protected async isElementVisible(locator: Locator, options?: { timeout?: number }): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 10000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks if element is hidden or not present
     * @param locator - Element locator to check
     * @param options - Optional wait options
     * @returns Promise<boolean> indicating if element is hidden
     */
    protected async isElementHidden(locator: Locator, options?: { timeout?: number }): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout: options?.timeout ?? 30000 });
    }


    /**
     * Waits for a condition to be true with timeout
     * @param condition - Function that returns a promise resolving to boolean
     * @param timeout - Maximum time to wait in milliseconds
     * @param message - Error message if timeout is reached
     */
    protected async waitForCondition(
        condition: () => Promise<boolean>,
        timeout: number = 5000,
        message: string = 'Condition not met within timeout'
    ): Promise<void> {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return;
            }
            await this.waitForNumberOfSeconds(0.1);
        }
        throw new Error(message);
    }

    /**
     * 
     * @param locator - Locator for the element
     * @param property - CSS property to retrieve
     * @returns - CSS property value
     */
    protected async getElementCSSPropertyValue(locator: Locator, property: string): Promise<string> {
        const computedStyle = await locator.evaluate(node => window.getComputedStyle(node));
        return computedStyle[property];
    }
} 
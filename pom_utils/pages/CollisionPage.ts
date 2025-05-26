import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "../helpers/BaseHelper";
import { constants } from '../../pom_utils/config/constants';

export class CollisionPage extends BaseHelper {
    private readonly subheaderYMME: Locator;
    private readonly pageHeaderTitle: Locator;
    private readonly changeVehicleButton: Locator;
    private readonly ymmePageSearch: Locator;
    private readonly yearComboBox: Locator;
    private readonly collisionReferenceLink: Locator;
    private readonly collisionArticleTitle: Locator;
    private readonly positionStatementsLink: Locator;
    private readonly positionStatementsHeader: Locator;
    private readonly positionStatementsArticleList: Locator;
    private newPage: Page;

    constructor(page: Page) {
        super(page);
        this.subheaderYMME = this.page.locator('.ad-vehicle-block');
        this.pageHeaderTitle = this.page.locator('.product-name');
        this.changeVehicleButton = this.page.locator('#change .title');
        this.ymmePageSearch = this.page.locator('#ymmeSearchBox');
        this.yearComboBox = this.page.locator('span[role="combobox"][aria-label="Year"]');
        this.collisionArticleTitle = this.page.locator('h3.repair-page-title');
        this.collisionReferenceLink = this.page.locator('.sub-itype', { hasText: 'Collision Reference' });
        this.positionStatementsLink = this.page.getByText('Position Statements');
        this.positionStatementsHeader = this.page.locator('.non-standard .header .title');
        this.positionStatementsArticleList = this.page.locator('.content .non-standards-list');
    }

    protected async safeClick(locator: Locator, options?: { timeout?: number, force?: boolean }): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 5000 });
        await locator.click({ force: options?.force ?? false });
    }

    async clickSubheaderYMME(): Promise<void> {
        await this.safeClick(this.subheaderYMME);
        await this.waitForNumberOfSeconds(1);
    }

    async navigateToCollisionPage() {
        await this.page.goto('/repair/', { waitUntil: 'domcontentloaded' });
        await this.waitForNumberOfSeconds(1);
    }

    async verifyCollisionPageTitle(): Promise<boolean> {
        return (await this.pageHeaderTitle.textContent())?.toLowerCase().includes('collision') ?? false;
    }

    async clickChangeVehicleButton(): Promise<void> {
        await this.changeVehicleButton.click();
        await this.waitForNumberOfSeconds(1);
        await this.yearComboBox.waitFor({ state: "visible", timeout: 5000 });
    }

    async navigateToPositionStatementsVehicle(number: number = 0): Promise<void> {
        await this.ymmePageSearch.fill(constants.COLLISION_UI.positionStatementsTestVehicleYmme[number]);
        await this.ymmePageSearch.press('Enter');
        await this.waitForNumberOfSeconds(1);
        await this.page.locator('.engine-selection-container .list-group-item .ymme').click();
        await this.waitForNumberOfSeconds(3);
    }

    async clickCollisionReferenceLink(): Promise<void> {
        await this.safeClick(this.collisionReferenceLink, { timeout: 10000 });
    }

    async clickPositionStatementsLink(): Promise<void> {
        await this.safeClick(this.positionStatementsLink, { timeout: 10000 });
    }

    async verifyPositionStatementsTitle(): Promise<boolean> {
        return (await this.positionStatementsHeader.textContent())?.toLowerCase().includes(constants.COLLISION_UI.positionStatementsTitle) ?? false;
    }

    async navigateRandomPositionStatementsArticle(): Promise<string> {
        const articlesCount = await this.positionStatementsArticleList.count();
        let articleName;
        if (articlesCount > 1) {
            const randomIndex = Math.floor(Math.random() * articlesCount);
            articleName = await this.positionStatementsArticleList.nth(randomIndex).textContent();
            await this.positionStatementsArticleList.nth(randomIndex).getByRole('link').click();
        } else {
            articleName = await this.positionStatementsArticleList.textContent();
            await this.positionStatementsArticleList.getByRole('link').click();
        }
        await this.page.waitForLoadState('domcontentloaded');
        return articleName;
    }

    async getRandomPositionStatementsArticlePath(): Promise<string> {
        const articlesCount = await this.positionStatementsArticleList.count();
        let articlePath;
        if (articlesCount > 1) {
            const randomIndex = Math.floor(Math.random() * articlesCount);
            articlePath = await this.positionStatementsArticleList.nth(randomIndex).getByRole('link').getAttribute('href');
        } else {
            articlePath = await this.positionStatementsArticleList.getByRole('link').getAttribute('href');
        }
        return articlePath;
    }

    async getPositionStatementsArticleTitle(): Promise<string> {
        return await this.collisionArticleTitle.textContent() ?? '';
    }

    async navigateToPathWithinNewTab(path: string): Promise<void> {
        this.newPage = await this.page.context().newPage();
        await this.newPage.goto(`/repair/${path}`, { waitUntil: 'domcontentloaded' });
    }

    async verifyArticleContentIsNotEmpty(): Promise<boolean> {
        const articleLeftSection = this.newPage.locator('ad-repair-pdf-article');
        return await articleLeftSection.evaluate(el => el.children.length > 0);
    }
}
import { Page as PuppeteerPage } from 'puppeteer';
import { ProviderBase } from './ProviderBase';
export declare class PuppeteerProvider extends ProviderBase {
    readonly puppeteer: PuppeteerPage;
    static create(puppeteer: PuppeteerPage): Promise<PuppeteerProvider>;
    private constructor();
    execute<T>(func: (...args: any[]) => T, ...args: any[]): Promise<T>;
    resizeWidth(width: number): Promise<void>;
    screenshot(path: string): Promise<void>;
    getRealHeight(): Promise<number>;
    scrollTo(height: number): Promise<number>;
}

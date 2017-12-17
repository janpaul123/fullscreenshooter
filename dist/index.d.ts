/// <reference types="nightmare" />
import * as Nightmare from 'nightmare';
import * as Puppeteer from 'puppeteer';
import { ProviderBase } from './providers/ProviderBase';
export interface IFullScreenshotOptions {
    nightmare?: Nightmare;
    puppeteer?: Puppeteer.Page;
    widths: number[];
    basePath: string;
    disableAnimations?: string[];
    navbarOffset?: number;
    unreveal?: boolean;
}
export default class FullScreenshot {
    static create(options: IFullScreenshotOptions): Promise<FullScreenshot>;
    readonly provider: ProviderBase;
    readonly options: IFullScreenshotOptions;
    private constructor();
    save(name: string): Promise<void>;
    unreveal(): Promise<void>;
    disableAnimations(): Promise<void>;
}

/// <reference types="nightmare" />
import * as Nightmare from 'nightmare';
import { IProviderInfo, ProviderBase } from './providers/ProviderBase';
export interface INightmareProviderInfo extends IProviderInfo {
    userAgent: string;
}
export declare class NightmareProvider extends ProviderBase {
    readonly nightmare: Nightmare;
    readonly info: INightmareProviderInfo;
    static create(nightmare: Nightmare): Promise<NightmareProvider>;
    private constructor();
    execute<T>(func: (...args: any[]) => T): Promise<T>;
    resizeWidth(width: number): Promise<void>;
    screenshot(path: string): Promise<void>;
    getRealHeight(): Promise<number>;
    scrollTo(height: number): Promise<number>;
}

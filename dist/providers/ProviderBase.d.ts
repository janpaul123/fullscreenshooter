import { IWindowSizes } from '../types';
export declare abstract class ProviderBase {
    readonly info: IProviderInfo;
    constructor(info: IProviderInfo);
    abstract resizeWidth(width: number): Promise<void>;
    abstract getRealHeight(): Promise<number>;
    abstract scrollTo(height: number): Promise<number>;
    abstract screenshot(path: string): Promise<void>;
    abstract execute<T>(func: (...args: any[]) => T, ...args: any[]): Promise<T>;
}
export interface IProviderInfo {
    scrollbarWidth: number;
    windowSizes: IWindowSizes;
    pixelDensity: number;
}

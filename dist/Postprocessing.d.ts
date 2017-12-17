import { ISize } from './types';
export declare function preprocess(path: string, desiredDimensions: ISize, pixelDensity: number, scrollbarWidth: number, navbarOffset?: number): Promise<void>;
export declare function finalize(subImages: string[], desiredDimensions: ISize, pixelDensity: number, scrollbarWidth: number, lastImgOffset: number, navbarOffset: number, outputPath: string): Promise<void>;

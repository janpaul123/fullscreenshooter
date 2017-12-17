import { ISize } from './types';
export declare function getSize(path: string): Promise<ISize>;
export declare function resize(path: string, size: ISize): Promise<void>;
export interface ICropArea extends ISize {
    x?: number;
    y?: number;
}
export declare function crop(path: string, area: ICropArea): Promise<void>;

export type ValueOf<T> = T extends { [K in keyof T]: infer V } ? V : never;

export type GenericFunc<I extends any[] = [], R = void> = (...args: I) => R;
export type Mappable<K, V> = Map<K, V> | [K, V][];

export interface Constructor<T, A extends any[]> {
    new (...args: A): T;
}

declare global {
    interface Array<T> {
        equal(other: Array<T>): boolean;
    }
}
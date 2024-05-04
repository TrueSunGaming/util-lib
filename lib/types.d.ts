export type ValueOf<T> = T extends { [K in keyof T]: infer V } ? V : never;

export interface Constructor<T, A extends any[]> {
    new (...args: A): T;
}
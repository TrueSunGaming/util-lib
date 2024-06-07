import { Factory } from "./Factory";
import { GenericFunc } from "./types";

export class CallFactory<K, I extends any[] = [], R = void> extends Factory<K, GenericFunc<I, R>> {
    call<T extends R = R>(key: K, ...args: I): T {
        const func: GenericFunc<I, R> = this.create(key);

        return func(...args) as T;
    }
}
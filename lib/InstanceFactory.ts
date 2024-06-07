import { Factory } from "./Factory";
import { Constructor } from "./types";

export class InstanceFactory<K, V, A extends any[] = []> extends Factory<K, Constructor<V, A>> {
    construct<T extends V = V>(key: K, ...args: A): T {
        const constructor: Constructor<T, A> = this.create(key);

        return new constructor(...args);
    }
}
import { Constructor, Mappable } from "./types";

export class Factory<K, O = any, A extends any[] = []> {
    private registry: Map<K, Constructor<O, A>> = new Map();

    constructor(map?: Mappable<K, Constructor<O, A>>) {
        if (map) this.registry = new Map(map);
    }

    register(key: K, value: Constructor<O, A>) {
        this.registry.set(key, value);
    }

    isRegistered(key: K): boolean {
        return this.registry.has(key);
    }

    create<V extends O = O>(key: K, ...args: A): V {
        if (!this.isRegistered(key)) throw new Error(`No registered constructor for key: ${key}`);

        const con: Constructor<V, A> = this.registry.get(key)! as Constructor<V, A>;
        return new con(...args);
    }
}
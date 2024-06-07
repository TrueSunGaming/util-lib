import { Mappable } from "./types";

export class Factory<K, V> {
    private registry: Map<K, V> = new Map();

    constructor(map?: Mappable<K, V>) {
        if (map) this.registry = new Map(map);
    }

    register(key: K, value: V) {
        this.registry.set(key, value);
    }

    isRegistered(key: K): boolean {
        return this.registry.has(key);
    }

    create<T extends V = V>(key: K): T {
        if (!this.isRegistered(key)) throw new Error(`Key not found in Factory registry: ${key}`);

        return this.registry.get(key)! as T;
    }
}
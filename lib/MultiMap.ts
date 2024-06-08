export class MultiMap<K extends any[], V> {
    private entries: [K, V][] = [];

    set(keys: K, value: V): void {
        for (const i of this.entries) {
            if (i[0].equal(keys)) {
                i[1] = value;
                return;
            }
        }
    }

    get(keys: K): V | undefined {
        for (const i of this.entries) {
            if (i[0].equal(keys)) return i[1];
        }

        return undefined;
    }
}
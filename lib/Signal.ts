import { GenericFunc } from "./GenericFunc";

export class Signal<T extends any[]> {
    private listeners: GenericFunc<T>[] = [];

    isConnected(func: GenericFunc<T>): boolean {
        return this.listeners.includes(func);
    }

    connect(func: GenericFunc<T>): void {
        this.listeners.push(func);
    }

    disconnect(func: GenericFunc<T>): void {
        if (!this.isConnected(func)) return;

        this.listeners.splice(this.listeners.indexOf(func), 1);
    }

    emit(...data: T): void {
        for (const i of this.listeners) i(...data);
    }

    wait(timeout = -1): Promise<T> {
        return new Promise((res, rej) => {
            const fn: GenericFunc<T> = (...args: T) => res(args)
            this.connect(fn);

            if (timeout < 0) return;

            setTimeout(() => {
                this.disconnect(fn);
                rej("Signal timed out");
            }, timeout);
        });
    }

    static createFromEvent(target: EventTarget, event: string): Signal<[Event]> {
        const res: Signal<[Event]> = new Signal();

        target.addEventListener(event, res.emit);

        return res;
    }
}
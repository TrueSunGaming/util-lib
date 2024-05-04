import { GenericFunc } from "./GenericFunc";
import { TimeSpan } from "./TimeSpan";

export class Signal<T extends any[] = []> {
    private m_Emitted = false;
    private m_LastValue: T | null = null;
    private listeners: GenericFunc<T>[] = [];

    isConnected(func: GenericFunc<T>): boolean {
        return this.listeners.includes(func);
    }

    connect(func: GenericFunc<T>): GenericFunc<T> {
        this.listeners.push(func);

        return func;
    }

    disconnect(func: GenericFunc<T>): void {
        if (!this.isConnected(func)) return;

        this.listeners.splice(this.listeners.indexOf(func), 1);
    }

    emit(...data: T): void {
        for (const i of this.listeners) i(...data);

        this.m_Emitted = true;
        this.m_LastValue = data;
    }

    wait(timeout?: TimeSpan | number): Promise<T> {
        const timeoutMS: number = TimeSpan.numerify(timeout ?? -1);

        return new Promise((res, rej) => {
            const fn: GenericFunc<T> = (...args: T) => res(args)
            this.connect(fn);

            if (timeoutMS < 0) return;

            setTimeout(() => {
                this.disconnect(fn);
                rej("Signal timed out");
            }, timeoutMS);
        });
    }

    static createFromEvent(target: EventTarget, event: string): Signal<[Event]> {
        const res: Signal<[Event]> = new Signal();

        target.addEventListener(event, (e: Event) => res.emit(e));

        return res;
    }

    static createFromTimeout(timeout: TimeSpan | number): Signal {
        const res: Signal = new Signal();

        setTimeout(res.emit, TimeSpan.numerify(timeout));

        return res;
    }

    static createFromPromise<T>(promise: Promise<T>, fallbackValue?: T): Signal<[T | null, any]> {
        const res: Signal<[T | null, any]> = new Signal();

        promise.then((v) => res.emit(v, null));
        promise.catch((r) => res.emit(fallbackValue ?? null, r));

        return res;
    }

    get emitted(): boolean {
        return this.m_Emitted;
    }

    get lastValue(): T | null {
        return this.m_LastValue;
    }
}
import { Signal } from "./Signal";
import { TimeSpan } from "./TimeSpan";

export class SignalOnce<T extends any[] = []> extends Signal<T> {
    override emit(...data: T): void {
        if (!this.emitted) super.emit(...data);
    }

    override wait(timeout?: TimeSpan | number): Promise<T> {
        if (this.emitted) return new Promise((res) => res(this.lastValue!));

        return super.wait(timeout);
    }
    
    static createFromSignal<T extends any[] = []>(signal: Signal<T>): SignalOnce<T> {
        const res: SignalOnce<T> = new SignalOnce();

        signal.connect((...data: T) => res.emit(...data));

        return res;
    }

    static override createFromEvent(target: EventTarget, event: string): SignalOnce<[Event]> {
        return SignalOnce.createFromSignal(super.createFromEvent(target, event));
    }

    static override createFromTimeout(timeout: TimeSpan | number): SignalOnce {
        return SignalOnce.createFromSignal(super.createFromTimeout(timeout));
    }

    static override createFromPromise<T>(promise: Promise<T>, fallbackValue?: T): SignalOnce<[T | null, any]> {
        return SignalOnce.createFromSignal(super.createFromPromise(promise, fallbackValue));
    }
}
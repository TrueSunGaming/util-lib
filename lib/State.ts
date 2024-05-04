import { Signal } from "./Signal";

export class State<T> {
    private m_Value: T;

    changed: Signal<[T]> = new Signal();

    constructor(value: T) {
        this.m_Value = value;
        this.triggerReactivity();
    }

    triggerReactivity(): void {
        this.changed.emit(this.m_Value);
    }

    get value(): T {
        return this.m_Value;
    }

    set value(val: T) {
        this.m_Value = val;
        this.triggerReactivity();
    }

    setValueNonReactive(val: T): void {
        this.m_Value = val;
    }
}

export type MapState<T extends any[]> = {
    [I in keyof T]: State<T[I]>;
};

export type MaybeState<T> = T | State<T>;
export type StateExtract<T extends State<any>> = T extends State<infer U> ? U : T;
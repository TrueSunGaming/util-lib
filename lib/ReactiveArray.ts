import { DerivedState } from "./DerivedState";
import { GenericFunc } from "./types";
import { Signal } from "./Signal";
import { MaybeState, State, StateExtract } from "./State";

export type ReactiveArrayElement<T> = DerivedState<T | undefined, [number | null, T[]]>

export class ReactiveArray<T> extends State<T[]> {
    private insertion: Signal<[number]> = new Signal();
    private deletion: Signal<[number]> = new Signal();
    private activeConnections: [State<number | null>, GenericFunc<T[]>][] = [];

    constructor(value: T[]) {
        super(value);
    }

    private createPositionState(idx: number): State<number | null> {
        const state: State<number | null> = new State(idx as number | null);

        this.insertion.connect((loc) => {
            if (state.value == null || loc > state.value) return;

            state.value++;
            state.triggerReactivity();
        });

        this.deletion.connect((loc) => {
            if (state.value == null || loc > state.value) return;

            if (loc < state.value) state.value--;
            if (loc == state.value) state.value = null;

            state.triggerReactivity();
        });

        return state;
    }

    private connectReactivity(idx: number, value: MaybeState<T>): T {
        if (value instanceof State) {
            const connection: number = this.activeConnections.findIndex((v) => v[0].value == idx);
            if (connection != -1) value.unbind(this.activeConnections[connection][1]);

            const posState: State<number | null> = this.createPositionState(idx);
            
            this.activeConnections.push([
                posState,
                value.bind((v) => {
                    if (posState.value != null) this.set(posState.value, v)
                })
            ]);
        }

        return value instanceof State ? value.value : value
    }

    *[Symbol.iterator](): Generator<ReactiveArrayElement<T>> {
        for (let i = 0; i < this.value.length; i++) yield this.at(i);
    }

    at(idx: number): ReactiveArrayElement<T> {
        const positionState: State<number | null> = this.createPositionState(idx);

        return new DerivedState((ps: StateExtract<State<number | null>>, arr: T[]) => ps != null ? arr[ps] : undefined, [positionState, this]);
    }

    push(value: MaybeState<T>): void {
        this.insertion.emit(this.value.length);
        this.value.push(this.connectReactivity(this.value.length, value));
        this.triggerReactivity();
    }

    pop(): void {
        this.value.pop();
        this.deletion.emit(this.value.length);
        this.triggerReactivity();
    }

    shift(): void {
        this.value.shift();
        this.deletion.emit(0);
        this.triggerReactivity();
    }

    unshift(value: MaybeState<T>): void {
        this.insertion.emit(0);
        this.value.unshift(this.connectReactivity(0, value));
        this.triggerReactivity();
    }

    splice(start: number, deleteCount: number): void {
        this.value.splice(start, deleteCount);
        for (let i = start; i < start + deleteCount; i++) this.deletion.emit(i);
        this.triggerReactivity();
    }

    insert(idx: number, value: MaybeState<T>): void {
        this.insertion.emit(idx);
        this.value.splice(idx, 0, this.connectReactivity(idx, value));
        this.triggerReactivity();
    }

    set(idx: number, value: MaybeState<T>): void {
        this.value[idx] = this.connectReactivity(idx, value);
        this.triggerReactivity();
    }

    get states(): ReactiveArrayElement<T>[] {
        return this.value.map((_, i) => this.at(i));
    }
}
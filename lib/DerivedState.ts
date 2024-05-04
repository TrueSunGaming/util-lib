import { GenericFunc } from "./types";
import { MapState, State } from "./State";

export class DerivedState<T, I extends any[]> extends State<T> {
    private derivation: GenericFunc<I, T>;
    private states: MapState<I>

    constructor(derivation: GenericFunc<I, T>, states: MapState<I>) {
        super(derivation(...states.map((v) => v.value) as I));

        this.derivation = derivation;
        this.states = states;

        for (const i of states) i.bind(() => this.triggerReactivity());
    }

    private get nextValue(): T {
        return this.derivation(...this.states.map((v) => v.value) as I);
    }

    override triggerReactivity(): void {
        if (this.states) this.setValueNonReactive(this.nextValue);
        super.triggerReactivity();
    }
}
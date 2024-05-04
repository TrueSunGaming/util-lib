import { State, DerivedState, ReactiveArray } from "../lib";

const arr: ReactiveArray<number> = new ReactiveArray([] as number[]);
arr.changed.connect(console.log);

const state: State<number> = new State(1);
const derived: DerivedState<number, [number]> = new DerivedState((x) => x + 1, [state]);

console.log("push");
arr.push(state);
console.log("push");
arr.push(69);
console.log("unshift");
arr.unshift(derived);

console.log("increment");
state.value += 1;
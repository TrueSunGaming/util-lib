import { Matrix } from "../lib";

const a: Matrix = Matrix.fromValues([
    [1, 0, 1],
    [2, 1, 1],
    [0, 1, 1],
    [1, 1, 2]
]);

const b: Matrix = Matrix.fromValues([
    [1, 2, 1],
    [2, 3, 1],
    [4, 2, 2]
]);

console.log(a.mul(b).transposed);
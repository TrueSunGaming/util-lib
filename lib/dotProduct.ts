export function dotProduct(a: number[], b: number[]): number {
    if (a.length != b.length) throw new Error("Vectors must have the same length to calculate dot product");

    return a.reduce((t, v, i) => t + v * b[i], 0);
}
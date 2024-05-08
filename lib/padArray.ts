export function padArray<T>(arr: T[], size: number, padValue: T): T[] {
    if (arr.length > size) return arr.slice(0, size);
    return arr.length < size ? arr.concat(new Array(size - arr.length).fill(padValue)) : structuredClone(arr);
}
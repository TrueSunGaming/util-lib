import "./types";

Array.prototype.equal = function <T>(other: Array<T>): boolean {
    if (this.length != other.length) return false;
    for (let i = 0; i < this.length; i++) if (this[i] != other[i]) return false;
    return true;
}
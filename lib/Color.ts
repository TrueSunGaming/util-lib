import { clamp } from "./clamp";

export class Color {
    private m_R8: number = 0;
    private m_G8: number = 0;
    private m_B8: number = 0;
    private m_A8: number = 255;

    constructor(r8 = 0, g8 = 0, b8 = 0, a8 = 255) {
        this.r8 = r8;
        this.g8 = g8;
        this.b8 = b8;
        this.a8 = a8;
    }

    static fromHex(hex: string): Color {
        if (!hex.match(/^#([\da-fA-F]{6}|[\da-fA-F]{8})$/)) throw new Error("Invalid hex string");
        const r: number = parseInt(hex.slice(1, 3), 16);
        const g: number = parseInt(hex.slice(3, 5), 16);
        const b: number = parseInt(hex.slice(5, 7), 16);
        const a: number = hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) : 255;
        return new Color(r, g, b, a);
    }

    get r8(): number {
        return this.m_R8;
    }

    set r8(r8: number) {
        this.m_R8 = clamp(r8, 0, 255);
    }

    get g8(): number {
        return this.m_G8;
    }

    set g8(g8: number) {
        this.m_G8 = clamp(g8, 0, 255);
    }

    get b8(): number {
        return this.m_B8;
    }

    set b8(b8: number) {
        this.m_B8 = clamp(b8, 0, 255);
    }

    get a8(): number {
        return this.m_A8;
    }

    set a8(a8: number) {
        this.m_A8 = clamp(a8, 0, 255);
    }

    get r(): number {
        return this.r8 / 255;
    }

    get g(): number {
        return this.g8 / 255;
    }

    get b(): number {
        return this.b8 / 255;
    }

    get a(): number {
        return this.a8 / 255;
    }

    get rHex(): string {
        return this.r8.toString(16).padStart(2, "0");
    }

    get gHex(): string {
        return this.g8.toString(16).padStart(2, "0");
    }

    get bHex(): string {
        return this.b8.toString(16).padStart(2, "0");
    }

    get aHex(): string {
        return this.a8.toString(16).padStart(2, "0");
    }

    get hex(): string {
        return `#${this.rHex}${this.gHex}${this.bHex}${this.aHex}`;
    }

    toString(): string {
        return this.hex;
    }

    get rgbaString(): string {
        return `rgba(${this.r8}, ${this.g8}, ${this.b8}, ${this.a8})`;
    }

    get rgba(): [number, number, number, number] {
        return [this.r, this.g, this.b, this.a];
    }

    get rgba8(): [number, number, number, number] {
        return [this.r8, this.g8, this.b8, this.a8];
    }
}
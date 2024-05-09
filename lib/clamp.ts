import { Rotation } from "./Rotation";

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function clampAngle(angle: Rotation): Rotation {
    const mod: number = angle.deg % 360;
    return Rotation.fromDeg(mod >= 0 ? mod : mod + 360);
}
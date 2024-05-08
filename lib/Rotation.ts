export class Rotation {
    private m_Rad: number = 0;

    constructor(rad: number) {
        this.m_Rad = rad;
    }

    static fromRad(rad: number): Rotation {
        return new Rotation(rad);
    }

    static fromDeg(deg: number): Rotation {
        return new Rotation(Rotation.degToRad(deg));
    }

    static degToRad(deg: number): number {
        return deg * Math.PI / 180;
    }

    static radToDeg(rad: number): number {
        return rad * 180 / Math.PI;
    }

    get rad(): number {
        return this.m_Rad;
    }

    set rad(rad: number) {
        this.m_Rad = rad;
    }

    get deg(): number {
        return Rotation.radToDeg(this.m_Rad);
    }

    set deg(deg: number) {
        this.m_Rad = Rotation.degToRad(deg);
    }
}
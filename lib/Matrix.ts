import { Rotation } from "./Rotation";
import { dotProduct } from "./dotProduct";
import { padArray } from "./padArray";

export class Matrix {
    private values: number[][] = [];

    constructor(rows: number, cols: number) {
        const validMessage: string = Matrix.isValidSize(rows, cols);
        if (validMessage != "") throw new Error(validMessage);

        this.rows = rows;
        this.cols = cols;
    }

    *[Symbol.iterator]() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                yield [this.values[r][c], r, c];
            }
        }
    }

    static isValidSize(rows: number, cols: number): string {
        if (rows % 1 != 0 || cols % 1 != 0) return "Matrix rows and columns must be integers";
        if (rows < 0 || cols < 0) return "Matrix rows and columns must be non-negative";
        if ((rows == 0 && cols != 0) || (cols == 0 && rows != 0)) return "Matrix rows and columns must be non-zero unless creating a 0x0 matrix";

        return "";
    }

    static isValidData(data: number[][]): boolean {
        // 0x0 matrix is valid
        if (data.length == 0) return true;

        for (const i of data) if (i.length != data[0].length) return false;

        return true;
    }

    private static getMatrixDataSize(data: number[][]): [number, number] {
        if (!Matrix.isValidData(data)) throw new Error("Invalid matrix data: column length is not constant");

        return [data.length, data[0]?.length ?? 0];
    }

    static fromValues(values: number[][]): Matrix {
        const res: Matrix = new Matrix(...Matrix.getMatrixDataSize(values));
        res.values = structuredClone(values);

        return res;
    }

    static rotation2D(rot: Rotation): Matrix {
        return Matrix.fromValues([
            [Math.cos(rot.rad), -Math.sin(rot.rad)],
            [Math.sin(rot.rad), Math.cos(rot.rad)]
        ]);
    }

    static rotation3Dx(rot: Rotation): Matrix {
        return Matrix.fromValues([
            [1, 0, 0],
            [0, Math.cos(rot.rad), -Math.sin(rot.rad)],
            [0, Math.sin(rot.rad), Math.cos(rot.rad)]
        ]);
    }

    static rotation3Dy(rot: Rotation): Matrix {
        return Matrix.fromValues([
            [Math.cos(rot.rad), 0, Math.sin(rot.rad)],
            [0, 1, 0],
            [-Math.sin(rot.rad), 0, Math.cos(rot.rad)]
        ]);
    }

    static rotation3Dz(rot: Rotation): Matrix {
        return Matrix.fromValues([
            [Math.cos(rot.rad), -Math.sin(rot.rad), 0],
            [Math.sin(rot.rad), Math.cos(rot.rad), 0],
            [0, 0, 1]
        ]);
    }

    static rotation3D(x: Rotation, y: Rotation, z: Rotation): Matrix {
        const a: number = x.rad;
        const b: number = y.rad;
        const c: number = z.rad;

        const sa: number = Math.sin(a);
        const sb: number = Math.sin(b);
        const sc: number = Math.sin(c);
        const ca: number = Math.cos(a);
        const cb: number = Math.cos(b);
        const cc: number = Math.cos(c);

        return Matrix.fromValues([
            [
                cb * cc,
                sa * sb * cc - ca * sc,
                ca * sb * cc + sa * sc
            ],
            [
                cb * sc,
                sa * sb * sc + ca * cc,
                ca * sb * sc - sa * sc
            ],
            [
                -sb,
                sa * cb,
                ca * cb
            ]
        ])
    }

    static scale2D(x: number, y: number): Matrix {
        return Matrix.fromValues([
            [x, 0],
            [0, y]
        ]);
    }

    static scale3D(x: number, y: number, z: number): Matrix {
        return Matrix.fromValues([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, z]
        ]);
    }

    get rows(): number {
        return this.values.length;
    }

    get cols(): number {
        return this.rows > 0 ? this.values[0].length : 0;
    }

    addRowEnd(data: number[] = new Array(this.cols).fill(0)): void {
        if (data.length < this.cols) data = data.concat(new Array(this.cols - data.length).fill(0));
        this.values.push(data);
    }

    addRow(at: number, data: number[] = new Array(this.cols).fill(0)): void {
        while (at > this.rows) this.addRowEnd();

        if (at == this.rows) this.addRowEnd(data);
        else this.values.splice(at, 0, data);
    }

    removeRowEnd(): void {
        this.values.pop();
    }

    removeRow(at: number): void {
        this.values.splice(at, 1);
    }

    addColumnEnd(data: number[] = new Array(this.rows).fill(0)): void {
        if (data.length < this.rows) data = data.concat(new Array(this.rows - data.length).fill(0));

        for (let i = 0; i < this.rows; i++) this.values[i].push(data[i]);
    }

    addColumn(at: number, data: number[] = new Array(this.rows).fill(0)): void {
        if (data.length < this.rows) data = data.concat(new Array(this.rows - data.length).fill(0));

        for (let i = 0; i < this.rows; i++) this.values[i].splice(at, 0, data[i]);
    }

    removeColumnEnd(): void {
        for (const i of this.values) i.pop();
    }

    removeColumn(at: number): void {
        for (const i of this.values) i.splice(at, 1);
    }

    set rows(rows: number) {
        if (rows < 0) throw new Error("Matrix rows must be greater than zero");
        if (rows % 1 != 0) throw new Error("Matrix rows must be an integer");

        while (this.rows > rows) this.removeRowEnd();
        while (this.rows < rows) this.addRowEnd();
    }

    set cols(cols: number) {
        if (cols < 0) throw new Error("Matrix columns must be greater than zero");
        if (cols % 1 != 0) throw new Error("Matrix columns must be an integer");
        
        while (this.cols > cols) this.removeColumnEnd();
        while (this.cols < cols) this.addColumnEnd();
    }

    private handleInvalidPosition(row: number, col: number): void {
        if (row < 0 || col < 0) throw new Error("Matrix coordinates must be greater than zero");
        if (row >= this.rows || col >= this.cols) throw new Error("Matrix coordinates must be less than the matrix dimensions");
        if (row % 1 != 0 || col % 1 != 0) throw new Error("Matrix coordinates must be an integer");
    }

    set(row: number, col: number, value: number): void {
        this.handleInvalidPosition(row, col);

        this.values[row][col] = value;
    }

    get(row: number, col: number): number {
        this.handleInvalidPosition(row, col);

        return this.values[row][col]
    }

    getRow(row: number): number[] {
        this.handleInvalidPosition(row, 0);

        return structuredClone(this.values[row]);
    }

    setRow(row: number, data: number[]): void {
        this.handleInvalidPosition(row, 0);
        this.values[row] = padArray(data, this.cols, 0);
    }

    getColumn(column: number): number[] {
        this.handleInvalidPosition(0, column);

        return this.values.map((v) => v[column]);
    }

    setColumn(column: number, data: number[]): void {
        this.handleInvalidPosition(0, column);

        for (let i = 0; i < this.rows; i++) this.values[i][column] = data[i] ?? 0;
    }

    sameSize(other: Matrix): boolean {
        return this.rows == other.rows && this.cols == other.cols;
    }

    canMultiply(other: Matrix): boolean {
        return this.cols == other.rows;
    }

    get negated(): Matrix {
        const res: Matrix = structuredClone(this);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                res.values[r][c] *= -1;
            }
        }

        return res;
    }

    add(other: Matrix): Matrix {
        if (!this.sameSize(other)) throw new Error("Matrix sizes must be the same");

        const res: Matrix = structuredClone(this);

        for (const [_v, r, c] of res) {
            res.values[r][c] += other.values[r][c];
        }

        return res;
    }

    sub(other: Matrix): Matrix {
        return this.add(other.negated);
    }

    get transposed(): Matrix {
        const res: Matrix = new Matrix(this.cols, this.rows);
        for (let c = 0; c < this.rows; c++) res.setColumn(c, this.getRow(c));

        return res;
    }

    scale(other: number): Matrix {
        const res: Matrix = structuredClone(this);

        for (const [_v, r, c] of res) res.values[r][c] *= other;

        return res;
    }

    mul(other: Matrix): Matrix {
        const res: Matrix = new Matrix(this.rows, other.cols);

        for (let r = 0; r < res.rows; r++) {
            for (let c = 0; c < res.cols; c++) {
                res.set(r, c, dotProduct(this.getRow(r), other.getColumn(c)));
            }
        }

        return res;
    }
}
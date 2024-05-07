export class Matrix {
    private values: number[][] = [];

    constructor(rows: number, cols: number) {
        const valid: [boolean, string] = Matrix.isValidSize(rows, cols);
        if (!valid[0]) throw new Error(valid[1]);

        this.rows = rows;
        this.cols = cols;
    }

    static isValidSize(rows: number, cols: number): [boolean, string] {
        if (rows % 1 != 0 || cols % 1 != 0) return [false, "Matrix rows and columns must be integers"];

        return [true, ""];
    }

    static isValidData(data: number[][]): boolean {
        // 0x0 matrix is valid
        if (data.length == 0) return true;

        for (const i of data) if (i.length != data[0].length) return false;

        return true;
    }

    private static getMatrixDataSize(data: number[][]): [number, number] {
        return [data.length, data[0]?.length ?? 0];
    }

    static fromValues(): Matrix {

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

    set(x: number, y: number, value: number): void {
        if (x < 0 || y < 0) throw new Error("Matrix coordinates must be greater than zero");
        if (x >= this.rows || y >= this.cols) throw new Error("Matrix coordinates must be less than the matrix dimensions");
        if (x % 1 != 0 || y % 1 != 0) throw new Error("Matrix coordinates must be an integer");

        this.values[x][y] = value;
    }

    get(x: number, y: number): number {
        if (x < 0 || y < 0) throw new Error("Matrix coordinates must be greater than zero");
        if (x >= this.rows || y >= this.cols) throw new Error("Matrix coordinates must be less than the matrix dimensions");
        if (x % 1 != 0 || y % 1 != 0) throw new Error("Matrix coordinates must be an integer");

        return this.values[x][y]
    }

    sameSize(other: Matrix): boolean {
        return this.rows == other.rows && this.cols == other.cols;
    }

    canMultiply(other: Matrix): boolean {
        return this.cols == other.rows;
    }
}
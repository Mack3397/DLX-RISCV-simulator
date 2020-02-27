import { Registers } from "./registers";

export class DLXRegisters extends Registers{
    
    r: [0,      number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number];

    iar: number;
    mar: number;
    ir: number;
    temp: number;
    mdr: number;
    a: number;
    b: number;
    c: number;

    constructor() {
        super();
        this.r = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.iar = 0;
        this.mar = 0;
        this.ir = 0;
        this.temp = 0;
        this.mdr = 0;
        this.a = 0;
        this.b = 0;
    }
}

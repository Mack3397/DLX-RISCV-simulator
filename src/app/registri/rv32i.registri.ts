import { Registri } from "./registri";

export class RV32IRegistri extends Registri{

    x: [0, number, number , number, number, number, number, number, 
        number, number, number, number, number, number, number, number, 
        number, number, number, number, number, number, number, number, 
        number, number, number, number, number, number, number, number];

    instruction: number;
    opcode: number;
    rd: number;
    rs1: number;
    rs2: number;
    func3: number;
    func7: number;
    immediate: number;
    jumpOffset: number;

    constructor() {
        super();
        this.x = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.instruction = 0;
        this.opcode = 0;
        this.rd = 0;
        this.rs1 = 0;
        this.rs2 = 0;
        this.func3 = 0;
        this.func7 = 0;
        this.immediate = 0;
        this.jumpOffset = 0;
    }
}

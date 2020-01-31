export class Registri {
    // RV32I Registers
    x : [0, string, string , string, string, string, string, string, 
        string, string, string, string, string, string, string, string, 
        string, string, string, string, string, string, string, string, 
        string, string, string, string, string, string, string, string];
    //DLX Registers
    r : [0,     number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number];
    //Shared PC
    pc : string;
    
    //DLX encoder
    iar : number;
    mar : number;
    ir : number;
    temp : number;
    mdr : number;
    a : number;
    b : number;

    //RV32I encoder
    instruction : string;
    opcode : string;
    rd : string;
    rs1 : string;
    rs2 : string;
    func3 : string;
    func7 : string;
    immediate: string;
    jumpOffset: string;

    constructor(type: string) {
        this.pc = '00000000000000000000000000000000';
        if(type == "DLX") {
            this.r = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            this.iar = 0;
            this.mar = 0;
            this.ir = 0;
            this.temp = 0;
            this.mdr = 0;
            this.a = 0;
            this.b = 0;
        } else if (type == "RV32I") {
            this.x = [ 0, 
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000',
                '00000000000000000000000000000000'];

            this.instruction = '00000000000000000000000000000000';
            this.opcode = '0000000';
            this.rd = '00000';
            this.rs1 = '00000';
            this.rs2 = '00000';
            this.func3 = '000';
            this.func7 = '0000000';
            this.immediate = '00000000000000000000';
            this.jumpOffset = '00000000000000000000';
        }
    }
}

import { Interpreter } from './interpreter';
import { Registri } from '../registri/registri';
import { RV32IRegistri } from '../registri/rv32i.registri';
import { Memory } from '../memory/memory';

export class RV32Interpreter extends Interpreter {

    readonly instructions : {[key : string] : (args : (number | string)[], registers : RV32IRegistri, memory : Memory, usnigned ?: boolean) => number} = {
        // R-type instructions
        ADD : (args, registers, memory) => { 
            registers.func3 = 0; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 + registers.rs2; 
        },
        SUB : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)]  = registers.rs1 - registers.rs2;
        },
        SLL : (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 << (registers.rs2 & 0x1F);
        },
        SLT : (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 < registers.rs2 ? 1 : 0;
        },
        SLTU : (args, registers, memory) => {
            registers.func3 = 3; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = (registers.rs1 == 0) ? (registers.rs2 != 0 ? 1 : 0) : (registers.rs1 < registers.rs2 ? 1 : 0);
        },
        XOR : (args, registers, memory) => {
            registers.func3 = 4; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 ^ registers.rs2;
        },
        SRL : (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 >>> (registers.rs2 & 0x1F);
        },
        SRA : (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 >> (registers.rs2 & 0x1F);
        },
        OR : (args, registers, memory) => {
            registers.func3 = 6; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 | registers.rs2 & 0x1F;
        },
        AND : (args, registers, memory) => {
            registers.func3 = 7; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 & registers.rs2 & 0x1F;
        },

        // I-type instructions
        ADDI : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 + registers.immediate;
        },
        SLTI : (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = this.signExtend(registers.rs1) < registers.immediate ? 1 : 0;
        },
        SLTIU : (args, registers, memory) => {
            registers.func3 = 3; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.immediate == 1 ? (registers.rs1 == 0 ? 1 : 0) : (registers.rs1 < registers.immediate ? 1 : 0);
        },
        XORI : (args, registers, memory) => {
            registers.func3 = 4; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.immediate == -1 ? (registers.rs1 ^ 1) : (registers.rs1 ^ registers.immediate);
        },
        ORI : (args, registers, memory) => {
            registers.func3 = 6; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 | registers.immediate;
        },
        ANDI : (args, registers, memory) => {
            registers.func3 = 7; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 & registers.immediate;
        },
        SLLI : (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.rs1 << (registers.immediate & 0x1F);
        },
        SRLI : (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.rs1 >>> (registers.immediate & 0x1F);
        },
        SRAI : (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 32; 
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.rs1 >> (registers.immediate & 0x1F);
        },
        // I-type instructions [LOAD]
        LB : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0; 
            return registers.rd = registers.x[this.prepI(args, registers)] = ((1<<7) & ((memory.load(registers.rs1 + registers.immediate)) & 0x000000FF)) ? (memory.load(registers.rs1 + registers.immediate) & 0x000000FF) | 0xFFFFFF00 : (memory.load(registers.rs1 + registers.immediate) & 0x000000FF);
        },
        LH : (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            return registers.rd = registers.x[this.prepI(args, registers)] = ((1<<15) & (memory.load(registers.rs1 + registers.immediate) & 0x0000FFFF)) ? (memory.load(registers.rs1 + registers.immediate) & 0x0000FFFF) | 0xFFFF0000 : (memory.load(registers.rs1 + registers.immediate) & 0x00000FFFF);
        },
        LW : (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = memory.load(registers.rs1 + registers.immediate);
        },
        LBU : (args, registers, memory) => {
            registers.func3 = 4; registers.func7 = 0; 
            return registers.rd = registers.x[this.prepI(args, registers)] = memory.load(registers.rs1 + registers.immediate) & 0x000000FF;
        },
        LHU : (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 0; 
            return registers.rd = registers.x[this.prepI(args, registers)] = memory.load(registers.rs1 + registers.immediate) & 0x0000FFFF;
        },

        // S-type instructions 
        SB : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0;
            let val = registers.x[this.prepS(args, registers)] & 0xFF;
            memory.store(registers.rs1 + registers.immediate, val);
            return 0;
        },
        SH : (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            let val = registers.x[this.prepS(args, registers)] & 0xFFFF;
            memory.store(registers.rs1 + registers.immediate, val);
            return 1;
        },
        SW : (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;
            let val = registers.x[this.prepS(args, registers)] & 0xFFFFFFFF;
            memory.store(registers.rs1 + registers.immediate, val);
            return 2;
        },

        // U-type instructions 
        LUI : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 55;
            return registers.rd = registers.x[this.prepU(args, registers)] = registers.immediate;
        },
        AUIPC : (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 23;
            return registers.rd = registers.x[this.prepU(args, registers)] = (registers.pc - 4) + registers.immediate;
        },
    };

    prepR ([rd, rs1, rs2] : (number|string)[], registers : RV32IRegistri) : number {
        registers.opcode = 51;
        registers.rs1 = registers.x[rs1];
        registers.rs2 = registers.x[rs2];
        return rd as number;
    }

    prepI ([rd, rs1, immediate] : (number|string)[], registers : RV32IRegistri, unsigned : boolean = false) : number {
        registers.opcode = 19; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? (immediate as number) : (this.signExtend(immediate as number));
        return rd as number;
    }

    prepI_Load ([rd, immediate, rs1] : (number|string)[], registers : RV32IRegistri, unsigned : boolean = false) : number {
        registers.opcode = 3; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? (immediate as number) : (this.signExtend(immediate as number));
        return rd as number;
    }

    prepS ([rs2, immediate, rs1] : (number|string)[], registers : RV32IRegistri) : number {
        registers.opcode = 35;
        registers.rs1 = registers.x[rs1];
        registers.immediate = this.signExtend(immediate as number);
        return rs2 as number;
    }

    prepU ([rd, immediate] : (number|string)[], registers : RV32IRegistri) : number {
        registers.immediate = (immediate as number) << 12;
        return rd as number;
    }

    signExtend(immediate : number) : number {
        if((1<<11) & immediate) return (immediate | 0xFFFFF000);
        else return immediate;
    }

    run(line : string, registers: Registri, memory : Memory) : void {
        let [instruction, ... args] = line.split(/\W+/);
    
        let argsFixed = args.map<number>(arg => {
            if (arg.match(/^R[123]?\d/i)) {
                return parseInt(arg.substr(1));
            } else if (arg.match(/^[0-9A-F]{4}H/i)) {
                return parseInt(arg.substr(0, 4), 16)
            } else if (arg.match(/^[01]{16}B/i)) {
                return parseInt(arg.substr(0, 4), 2)
            } else return 0;
        });

        if (this.instructions[instruction])
            this.instructions[instruction](argsFixed, registers as RV32IRegistri, memory);  
    }
}
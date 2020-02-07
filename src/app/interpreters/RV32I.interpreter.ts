import { Interpreter } from './interpreter';
import { Registri } from '../registri/registri';
import { RV32IRegistri } from '../registri/rv32i.registri';
import { Memory } from '../memory/memory';

export class RV32Interpreter extends Interpreter {

    readonly instructions: {[key: string]: (args: number[], registers: RV32IRegistri, memory: Memory, usnigned ?: boolean) => number} = {
        // R-type instructions
        ADD: (args, registers) => { 
            registers.func3 = 0; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 + registers.rs2; 
        },
        SUB: (args, registers) => {
            registers.func3 = 0; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)]  = registers.rs1 - registers.rs2;
        },
        SLL: (args, registers) => {
            registers.func3 = 1; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs2 > 31 ? 0 : (registers.rs1 << registers.rs2) >>> 0;
        },
        SLT: (args, registers) => {
            registers.func3 = 2; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 < registers.rs2 ? 1 : 0;
        },
        SLTU: (args, registers) => {
            registers.func3 = 3; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = (registers.rs1 == 0) ? (registers.rs2 != 0 ? 1 : 0) : (registers.rs1 < registers.rs2 ? 1 : 0);
        },
        XOR: (args, registers) => {
            registers.func3 = 4; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 ^ registers.rs2;
        },
        SRL: (args, registers) => {
            registers.func3 = 5; registers.func7 = 0;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 >>> (registers.rs2 & 0x1F);
        },
        SRA: (args, registers) => {
            registers.func3 = 5; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 >> (registers.rs2 & 0x1F);
        },
        OR: (args, registers) => {
            registers.func3 = 6; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 | registers.rs2 & 0x1F;
        },
        AND: (args, registers) => {
            registers.func3 = 7; registers.func7 = 32;
            return registers.rd = registers.x[this.prepR(args, registers)] = registers.rs1 & registers.rs2 & 0x1F;
        },

        // I-type instructions
        ADDI: (args, registers) => {
            registers.func3 = 0; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 + registers.immediate;
        },
        SLTI: (args, registers) => {
            registers.func3 = 2; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = this.signExtend(registers.rs1) < registers.immediate ? 1 : 0;
        },
        SLTIU: (args, registers) => {
            registers.func3 = 3; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.immediate == 1 ? (registers.rs1 == 0 ? 1 : 0) : (registers.rs1 < registers.immediate ? 1 : 0);
        },
        XORI: (args, registers) => {
            registers.func3 = 4; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.immediate == -1 ? (registers.rs1 ^ 1) : (registers.rs1 ^ registers.immediate);
        },
        ORI: (args, registers) => {
            registers.func3 = 6; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 | registers.immediate;
        },
        ANDI: (args, registers) => {
            registers.func3 = 7; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers)] = registers.rs1 & registers.immediate;
        },
        SLLI: (args, registers) => {
            registers.func3 = 1; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.immediate > 31 ? 0 : (registers.rs1 << registers.immediate) >>> 0;
        },
        SRLI: (args, registers) => {
            registers.func3 = 5; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.rs1 >>> (registers.immediate & 0x1F);
        },
        SRAI: (args, registers) => {
            registers.func3 = 5; registers.func7 = 32; 
            return registers.rd = registers.x[this.prepI(args, registers, true)] = registers.rs1 >> (registers.immediate & 0x1F);
        },
        // I-type instructions [LOAD]
        LB: (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0;
            return registers.rd = registers.x[this.prepI_Load(args, registers)] = ((1<<7) & ((memory.load(Math.floor(registers.rs1 + registers.immediate) / 4)) & 0x000000FF)) ? (memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x000000FF) | 0xFFFFFF00 : (memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x000000FF);
        },
        LH: (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            return registers.rd = registers.x[this.prepI_Load(args, registers)] = ((1<<15) & (memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x0000FFFF)) ? (memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x0000FFFF) | 0xFFFF0000 : (memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x00000FFFF);
        },
        LW: (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;  
            return registers.rd = registers.x[this.prepI_Load(args, registers)] = memory.load(Math.floor(registers.rs1 + registers.immediate) / 4);
        },
        LBU: (args, registers, memory) => {
            registers.func3 = 4; registers.func7 = 0; 
            return registers.rd = registers.x[this.prepI_Load(args, registers)] = memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x000000FF;
        },
        LHU: (args, registers, memory) => {
            registers.func3 = 5; registers.func7 = 0; 
            return registers.rd = registers.x[this.prepI_Load(args, registers)] = memory.load(Math.floor(registers.rs1 + registers.immediate) / 4) & 0x0000FFFF;
        },
        // I-type instructions [JUMP]
        JALR: (args, registers) => {
            console.log('eseguo JALR');
            registers.func3 = 0; registers.func7 = 0;
            registers.rd = registers.x[this.prepI_Jump(args, registers)] = registers.pc;
            return registers.pc = registers.immediate = (registers.rs1 + registers.jumpOffset) & ~(1<<0);
        },

        // S-type instructions 
        SB: (args, registers, memory) => {
            registers.func3 = 0; registers.func7 = 0;
            let val = registers.rs2 = registers.x[this.prepS(args, registers)] & 0xFF;
            console.log(Math.floor(registers.rs1 + registers.immediate) / 4);
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, val);
            return 0;
        },
        SH: (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            let val = registers.rs2 =  registers.x[this.prepS(args, registers)] & 0xFFFF;
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, val);
            return 1;
        },
        SW: (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;
            let val = registers.rs2 =  registers.x[this.prepS(args, registers)] & 0xFFFFFFFF;
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, val);
            return 2;
        },

        // B-type instructions
        BEQ: (args, registers) => {
            registers.func3 = 0;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (registers.rs1 == registers.rs2 ? jumpOffset : registers.pc);
        },
        BNE: (args, registers) => {
            registers.func3 = 1;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (registers.rs1 != registers.rs2 ? jumpOffset : registers.pc);
        },
        BLT: (args, registers) => {
            registers.func3 = 4;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (this.signExtend(registers.rs1) < this.signExtend(registers.rs2) ? jumpOffset : registers.pc);
        },
        BGE: (args, registers) => {
            registers.func3 = 5;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (this.signExtend(registers.rs1) >= this.signExtend(registers.rs2) ? jumpOffset : registers.pc);
        },
        BLTU: (args, registers) => {
            registers.func3 = 6;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (registers.rs1 < registers.rs2 ? jumpOffset : registers.pc);
        },
        BGEU: (args, registers) => {
            registers.func3 = 7;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc = (registers.rs1 >= registers.rs2 ? jumpOffset : registers.pc);
        },

        // U-type instructions 
        LUI: ([rd, immediate], registers) => {
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 55;
            return registers.rd = registers.x[this.prepU([rd, immediate], registers)] = registers.immediate;
        },
        AUIPC: ([rd, immediate], registers) => {
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 23;
            return registers.rd = registers.x[this.prepU([rd, immediate], registers)] = (registers.pc - 4) + registers.immediate;
        },

        // J-type instructions
        JAL: ([rd, immediate], registers) => {
            if (rd == 0 ) {
                window.alert('Cannot wirte in register x0');
                registers.pc = 0;
                return;
            }
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 111;
            registers.rd = registers.x[rd] = registers.pc;
            registers.jumpOffset = immediate;
            return registers.pc = registers.jumpOffset;
        },
    };

    prepR ([rd, rs1, rs2]: number[], registers: RV32IRegistri): number {
        if (rd == 0 ) {
            window.alert('Cannot wirte in register x0');
            registers.pc = 0;
            return;
        }
        registers.opcode = 51;
        registers.rs1 = registers.x[rs1];
        registers.rs2 = registers.x[rs2];
        return rd;
    }

    prepI ([rd, rs1, immediate]: number[], registers: RV32IRegistri, unsigned: boolean = false): number {
        if (rd == 0) {
            window.alert('Cannot wirte in register x0');
            registers.pc = 0;
            return;
        }
        registers.opcode = 19; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? immediate : this.signExtend(immediate);
        return rd;
    }

    prepI_Load ([rd, immediate, rs1]: number[], registers: RV32IRegistri, unsigned: boolean = false): number {
        if (rd == 0) {
            window.alert('Cannot wirte in register x0');
            registers.pc = 0;
            return;
        }
        registers.opcode = 3; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? immediate : this.signExtend(immediate);
        return rd;
    }

    prepI_Jump ([rd, rs1, immediate]: number[], registers: RV32IRegistri) {
        registers.opcode = 111;
        registers.rs1 = registers.x[rs1];
        registers.jumpOffset = this.signExtend(immediate);
        return rd;
    }

    prepS ([rs2, immediate, rs1]: number[], registers: RV32IRegistri): number {
        registers.opcode = 35;
        registers.rs1 = registers.x[rs1];
        registers.immediate = this.signExtend(immediate);
        return rs2;
    }

    prepU ([rd, immediate]: number[], registers: RV32IRegistri): number {
        if (rd == 0 ) {
            window.alert('Cannot wirte in register x0');
            registers.pc = 0;
            return;
        }
        registers.immediate = (immediate) << 12;
        return rd;
    }

    prepB ([rs1, rs2, immediate]: number[], registers: RV32IRegistri): number {
        registers.opcode = 99; registers.func7 = 0;
        registers.rs1 = registers.x[rs1];
        registers.rs2 = registers.x[rs2];
        return registers.jumpOffset = this.signExtend(immediate);
    }

    signExtend(immediate: number): number {
        if((1<<11) & immediate) return (immediate | 0xFFFFF000);
        else return immediate;
    }

    run(line: string, registers: Registri, memory: Memory): void {
        let tokens = line.split(/\W+/);
        if (!tokens[0] || line.match(/\w+:/)) tokens.shift();

        let [instruction, ... args] = tokens;

        let argsFixed = args.map<number>(arg => {
            if (arg.match(/^R[123]?\d/i)) {
                return parseInt(arg.substr(1));
            } else if (arg.match(/^[0-9A-F]{4}H/i)) {
                return parseInt(arg.substr(0, 4), 16)
            } else if (arg.match(/^[01]{16}B/i)) {
                return parseInt(arg.substr(0, 4), 2)
            } else if (this.tags[arg]) {
                return this.tags[arg];
            } else return 0;
        });

        console.log(argsFixed);
        if (this.instructions[instruction])
            this.instructions[instruction](argsFixed, registers as RV32IRegistri, memory);  
    }
}
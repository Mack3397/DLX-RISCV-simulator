import { Interpreter } from './interpreter';
import { Registers } from '../registers/registers';
import { RV32IRegisters } from '../registers/rv32i.registers';
import { Memory } from '../memory/model/memory';
import { ThrowStmt } from '@angular/compiler';

const instructions_R  = 'ADD|SUB|SLL|SLT|SLTU|XOR|SRL|SRA|OR|AND';
const instructions_I  = 'ADDI|SLTI|SLTIU|XORI|ORI|ANDI|SLLI|SRLI|SRAI';
const instructions_IL = 'LB|LH|LW|LBU|LHU';
const instructions_IJ = 'JALR';
const instructions_S  = 'SB|SH|SW';
const instructions_B  = 'BEQ|BNE|BLT|BGE|BLTU|BGEU';
const instructions_U  = 'LUI|AUIPC';
const instructions_J  = 'JAL';
const instructions = instructions_R + '|' + instructions_I + '|' + instructions_IL + '|' + instructions_IJ + '|' + instructions_S + '|' + instructions_B + '|' + instructions_U + '|' + instructions_J;

export class RV32Interpreter extends Interpreter {

    tmpRegisters: RV32IRegisters = new RV32IRegisters;
    myMem: Memory = new Memory;
    readonly instructions: {[key: string]: (args: number[], registers: RV32IRegisters, memory: Memory, usnigned ?: boolean) => number} = {
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
            registers.rs2 = registers.x[this.prepS(args, registers)] & 0x000000FF;
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, registers.rs2);
            return 0;
        },
        SH: (args, registers, memory) => {
            registers.func3 = 1; registers.func7 = 0;
            registers.rs2 =  registers.x[this.prepS(args, registers)] & 0x0000FFFF;
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, registers.rs2);
            return 1;
        },
        SW: (args, registers, memory) => {
            registers.func3 = 2; registers.func7 = 0;
            registers.rs2 =  registers.x[this.prepS(args, registers)] & 0xFFFFFFFF;
            memory.store(Math.floor(registers.rs1 + registers.immediate) / 4, registers.rs2);
            return 2;
        },

        // B-type instructions
        BEQ: (args, registers) => {
            registers.func3 = 0;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (registers.rs1 == registers.rs2 ? jumpOffset : registers.pc) - 4;
        },
        BNE: (args, registers) => {
            registers.func3 = 1;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (registers.rs1 != registers.rs2 ? jumpOffset : registers.pc) - 4;
        },
        BLT: (args, registers) => {
            registers.func3 = 4;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (this.signExtend(registers.rs1) < this.signExtend(registers.rs2) ? jumpOffset : registers.pc) - 4;
        },
        BGE: (args, registers) => {
            registers.func3 = 5;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (this.signExtend(registers.rs1) >= this.signExtend(registers.rs2) ? jumpOffset : registers.pc) - 4;
        },
        BLTU: (args, registers) => {
            registers.func3 = 6;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (registers.rs1 < registers.rs2 ? jumpOffset : registers.pc) - 4;
        },
        BGEU: (args, registers) => {
            registers.func3 = 7;
            let jumpOffset = this.prepB(args, registers);
            return registers.pc += (registers.rs1 >= registers.rs2 ? jumpOffset : registers.pc) - 4;
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
            if (rd == 0 ) throw new Error("Cannot write into register x0");
            registers.func3 = 0; registers.func7 = 0; registers.opcode = 111;
            registers.rd = registers.x[rd] = registers.pc;
            registers.jumpOffset = immediate;
            return registers.pc = registers.jumpOffset;
        },
    };

    // PREP, Prepares args in the right format to be executed by the instructions
    prepR ([rd, rs1, rs2]: number[], registers: RV32IRegisters): number {
        if (rd == 0 ) throw new Error("Cannot write into register x0");
        registers.opcode = 51;
        registers.rs1 = registers.x[rs1];
        registers.rs2 = registers.x[rs2];
        return rd;
    }

    prepI ([rd, rs1, immediate]: number[], registers: RV32IRegisters, unsigned: boolean = false): number {
        if (rd == 0 ) throw new Error("Cannot write into register x0");
        registers.opcode = 19; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? immediate : this.signExtend(immediate);
        return rd;
    }

    prepI_Load ([rd, immediate, rs1]: number[], registers: RV32IRegisters, unsigned: boolean = false): number {
        if (rd == 0 ) throw new Error("Cannot write into register x0");
        registers.opcode = 3; 
        registers.rs1 = registers.x[rs1];
        registers.immediate = unsigned ? immediate : this.signExtend(immediate);
        return rd;
    }

    prepI_Jump ([rd, rs1, immediate]: number[], registers: RV32IRegisters) {
        registers.opcode = 111;
        registers.rs1 = registers.x[rs1];
        registers.jumpOffset = this.signExtend(immediate);
        return rd;
    }

    prepS ([rs2, immediate, rs1]: number[], registers: RV32IRegisters): number {
        registers.opcode = 35;
        registers.rs1 = registers.x[rs1];
        registers.immediate = this.signExtend(immediate);
        return rs2;
    }

    prepU ([rd, immediate]: number[], registers: RV32IRegisters): number {
        if (rd == 0 ) throw new Error("Cannot write into register x0");
        registers.immediate = (immediate) << 12;
        return rd;
    }

    prepB ([rs1, rs2, immediate]: number[], registers: RV32IRegisters): number {
        registers.opcode = 99; registers.func7 = 0;
        registers.rs1 = registers.x[rs1];
        registers.rs2 = registers.x[rs2];
        return registers.jumpOffset = this.signExtend(immediate);
    }

    signExtend(immediate: number): number {
        if((1<<11) & immediate) return (immediate | 0xFFFFF000);
        else return immediate;
    }

    run(line: string, registers: Registers, memory: Memory): void {
        let tokens: string[];
        let lineFixed: string;

        if (!line || line.match(/^;/)) {
            tokens = ['NOP'];
        } else {
            lineFixed = line.split(';')[0].replace(/^(\w+:)?\s+/, '');
            tokens = lineFixed.split(/\W+/);
        }

        let [instruction, ... args] = tokens;
        let argsFixed: number[] = [];
        let size = args.length;
        // Controllo se l'istruione è valida
        console.log(instruction);
        if(!instructions.split('|').includes(instruction)) {
             throw new Error ("Instruction doesn't exist");
        } else if(instructions_R.split('|').includes(instruction)) {
            if(!args[0].match(/^R[123]?\d/i) || !args[1].match(/^R[123]?\d/i) || !args[2].match(/^R[123]?\d/i) || (size > 3 && args[3] != '')) 
                throw new Error(instruction + " RD, RS1, RS2");
        } else if(instructions_I.split('|').includes(instruction) || instructions_IJ.split('|').includes(instruction) || instructions_B.split('|').includes(instruction)) {
            if(!args[0].match(/^R[123]?\d/i) || !args[1].match(/^R[123]?\d/i) || !args[2].match(/^0x([0-9A-F]{4})/i) || (size > 3 && args[3] != '')) 
                throw new Error(instruction + " RD, RS1, Immediate");
        } else if(instructions_S.split('|').includes(instruction) || instructions_IL.split('|').includes(instruction)) {
            if(!args[0].match(/^R[123]?\d/i) || !args[1].match(/^0x([0-9A-F]{4})/i) || !args[2].match(/^R[123]?\d/i) || (size > 3 && args[3] != '')) 
                throw new Error(instruction + " RD, Immediate, RS1");
        } else if(instructions_U.split('|').includes(instruction)) {
            if(!args[0].match(/^R[123]?\d/i) || !args[1].match(/^0x([0-9A-F]{4})/i) || (size > 2 && args[2] != '')) 
                throw new Error(instruction + " RD, Immediate");
        } else if(instructions_IJ.split('|').includes(instruction)) {
            if(!args[0].match(/^R[123]?\d/i) || !args[1].match(/^R[123]?\d/i) || (size > 3 && args[3] != '')) 
                throw new Error(instruction + " RD, RS1, Tag");
        } else if(instructions_J.split('|').includes(instruction) || (size > 2 && args[2] != '')) {
            if(!args[0].match(/^R[123]?\d/i)) 
                throw new Error(instruction + " RD, Tag");
        }

        argsFixed = args.map<number>(arg => {
            if (arg.match(/^R[123]?\d/i)) {
                return parseInt(arg.substr(1));
            } else if (arg.match(/^0x([0-9A-F]{4})/i)) {
                //console.log(parseInt(arg.substr(2, 4), 16));
                return parseInt(arg.substr(2, 4), 16);
            } else if (this.tags[arg]) {
                return this.tags[arg];
            } else return 0;
        });

        console.log(argsFixed);
        this.myMem = memory;
        if (this.instructions[instruction])
            this.instructions[instruction](argsFixed, registers as RV32IRegisters, memory);  
    }
    
    decode(line: string): number {    
        try{   
            this.run(line, this.tmpRegisters, this.myMem);
            this.tmpRegisters.instruction = this.tmpRegisters.opcode + this.tmpRegisters.rd + this.tmpRegisters.rs1 + this.tmpRegisters.rs2 + this.tmpRegisters.func3 + this.tmpRegisters.func7 + this.tmpRegisters.jumpOffset +  + this.tmpRegisters.immediate;
            console.log(this.tmpRegisters.instruction);
            return this.tmpRegisters.instruction;
        } catch (error) {
            return 0;
        }
    }

    public interrupt(registers: Registers): void {
        //TODO to be implemented
    }
}

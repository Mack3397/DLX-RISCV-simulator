import { Interpreter } from '../interpreter';
import { Registri } from '../../registri/registri';
import { DLXRegistri } from '../../registri/dlx.registri';
import { Memory } from 'src/app/memory/memory';

export class DLXInterpreter extends Interpreter{

    //TODO aggiungi registro c

    //TODO specificare quali sono registri speciali
    readonly instructions: {[key: string]: (args: number[], registers: DLXRegistri, memory?: Memory, unsigned?: boolean) => number} = {
        ADD: (args, registers) => this.overflowCheck(this.instructions['ADDU'](args, registers)),
        ADDI: (args, registers) => this.overflowCheck(this.instructions['ADDUI'](args, registers, null, false)),
        ADDU: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a + registers.temp,
        ADDUI: (args, registers, memory, unsigned = true) => registers.r[this.prepI(args, registers, unsigned)] = registers.a + registers.temp,
        AND: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a & registers.temp,
        ANDI: (args, registers) => registers.r[this.prepI(args, registers, true)] = registers.a & registers.temp,
        BEQZ: () => null,
        BNEZ: ([rs1, name], registers) => registers.r[rs1] !== 0 ? registers.pc = name : 0,
        DIV: (args, registers) => Math.floor(registers.r[this.prepR(args, registers)] = registers.a / registers.temp),
        DIVI: (args, registers) => Math.floor(registers.r[this.prepI(args, registers)] = registers.a / registers.temp),
        J: () => null,
        JAL: () => null,
        JALR: () => null,
        JR: () => null,
        LB: (args, registers, memory) => {
            let [rd, offset] = this.prepILoad(args, registers);
            registers.mdr = memory.load(registers.mar);
            return registers.r[rd] = this.signExtend(this.load(registers.mdr, offset, 'byte'), 8);
        },
        LBU: (args, registers, memory) => {
            let [rd, offset] = this.prepILoad(args, registers);
            registers.mdr = memory.load(registers.mar);
            return registers.r[rd] = this.load(registers.mdr, offset, 'byte');
        },
        LH: (args, registers, memory) => {
            let [rd, offset] = this.prepILoad(args, registers);
            registers.mdr = memory.load(registers.mar);
            return registers.r[rd] = this.signExtend(this.load(registers.mdr, offset, 'halfword'));
        },
        LHI: ([rd, immediate], registers) => registers.r[rd] = immediate << 16,
        LHU: (args, registers, memory) => {
            let [rd, offset] = this.prepILoad(args, registers);
            registers.mdr = memory.load(registers.mar);
            return registers.r[rd] = this.load(registers.mdr, offset, 'halfword');
        },
        LW: (args, registers, memory) => {
            let [rd, offset] = this.prepILoad(args, registers);
            registers.mdr = memory.load(registers.mar);
            return registers.r[rd] = registers.mdr;
        },
        MOVI2S: ([rd, rs1], registers) => registers[rd] = registers.a = registers.r[rs1],
        MOVS2I: ([rd, rs1], registers) => registers.r[rs1] = registers[rd],
        //? sulle slide si chiama MUL e nel libro dice che funziona con FPR e non GPR (stessa cosa div)
        MULT: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a * registers.temp,
        //? qui e DIVI non ci sono nel libro al loro posto è definito DIVU e MULTU
        MULTI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a * registers.temp,
        NOP: () => null,
        OR: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a | registers.temp,
        ORI: (args, registers) => registers.r[this.prepI(args, registers, true)] = registers.a | registers.temp,
        RFE: () => null,
        SB: (args, registers, memory) => {
            let [rd, offset] = this.prepIStore(args, registers);
            registers.mdr = registers.r[rd];
            return memory.store(registers.mar, this.store(registers.mdr, memory.load(registers.mar), offset, 'byte'));
        },
        SEQ: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a == registers.temp ? 1 : 0,
        SEQI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a == registers.temp ? 1 : 0,
        SGE: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a >= registers.temp ? 1 : 0,
        SGEI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a >= registers.temp ? 1 : 0,
        SGT: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a > registers.temp ? 1 : 0,
        SGTI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a > registers.temp ? 1 : 0,
        SH: (args, registers, memory) => {
            let [rd, offset] = this.prepIStore(args, registers);
            registers.mdr = registers.r[rd];
            return memory.store(registers.mar, this.store(registers.mdr, memory.load(registers.mar), offset, 'halfword'));
        },
        SLE: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a <= registers.temp ? 1 : 0,
        SLEI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a <= registers.temp ? 1 : 0,
        SLL: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a << (registers.temp & 0x1F),
        SLLI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a << (registers.temp & 0x1F),
        SLT: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a < registers.temp ? 1 : 0,
        SLTI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a < registers.temp ? 1 : 0,
        SNE: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a != registers.temp ? 1 : 0,
        SNEI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a != registers.temp ? 1 : 0,
        SRA: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a >> (registers.temp & 0x1F),
        SRAI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a >> (registers.temp & 0x1F),
        SRL: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a >>> (registers.temp & 0x1F),
        SRLI: (args, registers) => registers.r[this.prepI(args, registers)] = registers.a >>> (registers.temp & 0x1F),
        SUB: (args, registers, memory) => this.overflowCheck(this.instructions['SUBU'](args, registers, memory)),
        SUBI: (args, registers, memory) => this.overflowCheck(this.instructions['SUBUI'](args, registers, memory, false)),
        SUBU: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a - registers.temp,
        SUBUI: (args, registers, memory, unsigned = true) => registers.r[this.prepI(args, registers, unsigned)] = registers.a - registers.temp,
        SW: (args, registers, memory) => {
            let [rd, offset] = this.prepIStore(args, registers);
            registers.mdr = registers.r[rd];
            return memory.store(registers.mar, registers.mdr);
        },
        TRAP: () => null,
        XOR: (args, registers) => registers.r[this.prepR(args, registers)] = registers.a ^ registers.temp,
        XORI: (args, registers) => registers.r[this.prepI(args, registers, true)] = registers.a ^ registers.temp,
    };

    prepR([rd, rs1, rs2]: (number)[], registers: DLXRegistri): number{
        registers.a = registers.r[rs1];
        registers.temp = registers.b = registers.r[rs2];
        return rd;
    }

    prepI([rd, rs1, immediate]: (number)[], registers: DLXRegistri, unsigned: boolean = false): number{
        registers.a = registers.r[rs1];
        registers.b = registers.r[rd];
        registers.temp = unsigned ? immediate : this.signExtend(immediate);
        return rd;
    }

    prepILoad([rd, offset, rs1]: (number)[], registers: DLXRegistri): [number, number] {
        registers.mar = Math.floor((this.signExtend(offset) + registers.r[rs1]) / 4);
        return [rd, offset];
    }

    prepIStore([offset, rs1, rd]: (number)[], registers: DLXRegistri): [number, number] {
        registers.mar = Math.floor((this.signExtend(offset) + registers.r[rs1]) / 4);
        return [rd, offset];
    }

    overflowCheck(n: number) {
        if (n > 0x7FFFFFFF) {
            // throw new Error('overflow');
            console.log('overflow');
        }
        return n;
    }

    signExtend(n: number, dim: (8|16|26) = 16) {
        let bin = (n >>> 0).toString(2).padStart(dim, '0');
        return parseInt(bin.padStart(32, bin.charAt(0)), 2);
    }

    private readonly mask = {
        byte: [
            0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000
        ],
        halfword: [
            0x0000FFFF, undefined, 0xFFFF0000, undefined
        ]
    }

    load(n: number, offset: number, dim: ('byte'|'halfword')) {
        if (n == 0) return 0;
        if (dim === 'halfword' && offset % 2 != 0) { console.log('fault'); return 0 }
        return n & this.mask[dim][offset % 4];
    }

    store(n: number, dest: number, offset: number, dim: ('byte'|'halfword')) {
        if (n == 0) return 0;
        if (dim === 'halfword' && offset % 2 != 0) { console.log('fault'); return 0 }
        let m = this.mask[dim];
        return ((n & m[0]) << ((offset % 4)*8)) | (dest & ~m[offset % 4]);
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

        // possos parsare qui i tag per le jump

        if (this.instructions[instruction])
            this.instructions[instruction](argsFixed, registers as DLXRegistri, memory);
    }
}

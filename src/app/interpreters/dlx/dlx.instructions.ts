import { DLXRegistri } from 'src/app/registri/dlx.registri';

function overflowCheck(n: number, negative: boolean = false) {
    if (negative) {
        if (n < -0x7FFFFFFF) {
            throw new Error('overflow');
        }
    } else {
        if (n > 0x7FFFFFFF) {
            throw new Error('overflow');
        }
    }
    return n;
}

export function signExtend(n: number, dim: (8|16|26) = 16) {
    let bin = (n >>> 0).toString(2).padStart(dim, '0');
    return parseInt(bin.padStart(32, bin.charAt(0)), 2);
}

const mask = {
    byte: [
        0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000
    ],
    halfword: [
        0x0000FFFF, undefined, 0xFFFF0000, undefined
    ]
}

function load(n: number, offset: number, dim: ('byte'|'halfword')) {
    if (n == 0) return 0;
    if (dim === 'halfword' && offset % 2 != 0) { console.log('fault'); return 0 }
    return n & mask[dim][offset % 4];
}

function store(n: number, dest: number, offset: number, dim: ('byte'|'halfword')) {
    if (n == 0) return 0;
    if (dim === 'halfword' && offset % 2 != 0) { console.log('fault'); return 0 }
    let m = mask[dim];
    return ((n & m[0]) << ((offset % 4)*8)) | (dest & ~m[offset % 4]);
}

export type InstructionType = 'R'|'RM'|'I'|'IB'|'IJ'|'IL'|'IS'|'J'|'LHI'|'NOP'|'RFE';
export type Instruction = 'ADD'|'ADDI'|'ADDU'|'ADDUI'|'AND'|'ANDI'|'BEQZ'|'BNEZ'|'DIV'|'DIVI'|'J'|'JAL'|'JALR'|'JR'|'LB'|'LBU'|'LH'|'LHI'|'LHU'|'LW'|'MOVI2S'|'MOVS2I'|'MULT'|'MULTI'|'NOP'|'OR'|'ORI'|'RFE'|'SB'|'SEQ'|'SEQI'|'SGE'|'SGEI'|'SGT'|'SGTI'|'SH'|'SLE'|'SLEI'|'SLL'|'SLLI'|'SLT'|'SLTI'|'SNE'|'SNEI'|'SRA'|'SRAI'|'SRL'|'SRLI'|'SUB'|'SUBI'|'SUBU'|'SUBUI'|'SW'|'TRAP'|'XOR'|'XORI';

export const instructions: {
        [key in Instruction]: {
            type: InstructionType, 
            func: (registers: DLXRegistri, args?: number[]) => number,
            unsigned?: boolean
        }
    } = {

    ADD:    { type: 'R',   func: (registers) => overflowCheck(instructions['ADDUI'].func(registers)) },
    ADDI:   { type: 'I',   func: (registers) => overflowCheck(instructions['ADDUI'].func(registers)) },
    ADDU:   { type: 'R',   func: (registers) => registers.c = registers.a + registers.temp },
    ADDUI:  { type: 'I',   func: (registers) => registers.c = registers.a + registers.temp, unsigned: true },
    AND:    { type: 'R',   func: (registers) => registers.c = registers.a & registers.temp },
    ANDI:   { type: 'I',   func: (registers) => registers.c = registers.a & registers.temp, unsigned: true },
    BEQZ:   { type: 'IB',  func: (registers) => registers.a === 0 ? registers.pc = registers.temp : 0 },
    BNEZ:   { type: 'IB',  func: (registers) => registers.a !== 0 ? registers.pc = registers.temp : 0 },
    DIV:    { type: 'R',   func: (registers) => registers.c = Math.floor(registers.a / registers.temp) },
    DIVI:   { type: 'I',   func: (registers) => registers.c = Math.floor(registers.a / registers.temp) },
    J:      { type: 'J',   func: (registers) => registers.pc = registers.temp },
    JAL:    { type: 'J',   func: (registers) => { registers.r[31] = registers.c = registers.pc + 4; return registers.pc = registers.temp; } },
    JALR:   { type: 'IJ',  func: (registers) => { registers.r[31] = registers.c = registers.pc + 4; return registers.pc = registers.a; } },
    JR:     { type: 'IJ',  func: (registers) => registers.pc = registers.a },
    LB:     { type: 'IL',  func: (registers) => registers.c = signExtend(load(registers.mdr, registers.temp, 'byte'), 8) },
    LBU:    { type: 'IL',  func: (registers) => registers.c = load(registers.mdr, registers.temp, 'byte') },
    LH:     { type: 'IL',  func: (registers) => registers.c = signExtend(load(registers.mdr, registers.temp, 'halfword')) },
    LHI:    { type: 'LHI', func: (registers) => registers.c = registers.temp << 16 },
    LHU:    { type: 'IL',  func: (registers) => registers.c = load(registers.mdr, registers.temp, 'halfword') },
    LW:     { type: 'IL',  func: (registers) => registers.c = registers.mdr },
    MOVI2S: { type: 'RM',  func: (registers, [rd, rs1]) => registers[rd] = registers.a = registers.r[rs1] },
    MOVS2I: { type: 'RM',  func: (registers, [rd, rs1]) => registers.r[rs1] = registers.c = registers[rd] },
    MULT:   { type: 'R',   func: (registers) => registers.c = registers.a * registers.temp },
    MULTI:  { type: 'R',   func: (registers) => registers.c = registers.a * registers.temp },
    NOP:    { type: 'NOP', func: () => null },
    OR:     { type: 'R',   func: (registers) => registers.c = registers.a | registers.temp },
    ORI:    { type: 'I',   func: (registers) => registers.c = registers.a | registers.temp, unsigned: true },
    RFE:    { type: 'RFE', func: (registers) => registers.pc = registers.iar },
    SB:     { type: 'IS',  func: (registers, [stored]) => store(registers.mdr, stored, registers.temp, 'byte') },
    SEQ:    { type: 'R',   func: (registers) => registers.c = registers.a == registers.temp ? 1 : 0 },
    SEQI:   { type: 'I',   func: (registers) => registers.c = registers.a == registers.temp ? 1 : 0 },
    SGE:    { type: 'R',   func: (registers) => registers.c = registers.a >= registers.temp ? 1 : 0 },
    SGEI:   { type: 'I',   func: (registers) => registers.c = registers.a >= registers.temp ? 1 : 0 },
    SGT:    { type: 'R',   func: (registers) => registers.c = registers.a > registers.temp ? 1 : 0 },
    SGTI:   { type: 'I',   func: (registers) => registers.c = registers.a > registers.temp ? 1 : 0 },
    SH:     { type: 'IS',  func: (registers, [stored]) => store(registers.mdr, stored, registers.temp, 'halfword') },
    SLE:    { type: 'R',   func: (registers) => registers.c = registers.a <= registers.temp ? 1 : 0 },
    SLEI:   { type: 'I',   func: (registers) => registers.c = registers.a <= registers.temp ? 1 : 0 },
    SLL:    { type: 'R',   func: (registers) => registers.c = registers.a << (registers.temp & 0x1F) },
    SLLI:   { type: 'I',   func: (registers) => registers.c = registers.a << (registers.temp & 0x1F) },
    SLT:    { type: 'R',   func: (registers) => registers.c = registers.a < registers.temp ? 1 : 0 },
    SLTI:   { type: 'I',   func: (registers) => registers.c = registers.a < registers.temp ? 1 : 0 },
    SNE:    { type: 'R',   func: (registers) => registers.c = registers.a != registers.temp ? 1 : 0 },
    SNEI:   { type: 'I',   func: (registers) => registers.c = registers.a != registers.temp ? 1 : 0 },
    SRA:    { type: 'R',   func: (registers) => registers.c = registers.a >> (registers.temp & 0x1F) },
    SRAI:   { type: 'I',   func: (registers) => registers.c = registers.a >> (registers.temp & 0x1F) },
    SRL:    { type: 'R',   func: (registers) => registers.c = registers.a >>> (registers.temp & 0x1F) },
    SRLI:   { type: 'I',   func: (registers) => registers.c = registers.a >>> (registers.temp & 0x1F) },
    SUB:    { type: 'R',   func: (registers) => overflowCheck(instructions['SUBUI'].func(registers), true) },
    SUBI:   { type: 'I',   func: (registers) => overflowCheck(instructions['SUBUI'].func(registers), true) },
    SUBU:   { type: 'R',   func: (registers) => registers.c = registers.a - registers.temp },
    SUBUI:  { type: 'I',   func: (registers) => registers.c = registers.a - registers.temp, unsigned: true },
    SW:     { type: 'IS',  func: (registers) => registers.mdr },
    TRAP:   { type: 'J',   func: (registers) => { registers.iar = registers.pc + 8; return registers.pc = registers.temp; }, unsigned: true },
    XOR:    { type: 'R',   func: (registers) => registers.c = registers.a ^ registers.temp },
    XORI:   { type: 'I',   func: (registers) => registers.c = registers.a ^ registers.temp, unsigned: true },
};

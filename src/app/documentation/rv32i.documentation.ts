import { Documentation } from './documentation.component';

export const RV32IDocumentation: Documentation[] = [
    // Register-Register Operations
  //{name: 'R-Type',type: 'R', syntax: 'INSTR RD, RS1, RS2',description: 'All operations read the RS1 and RS2 as source operands and write the result into register RD'},
    {name: 'ADD',   type: 'R', syntax: 'ADD RD, RS1, RS2',  description: 'ADD performs the addition of RS1 and RS2'},
    {name: 'SUB',   type: 'R', syntax: 'SUB RD, RS1, RS2',  description: 'SUB performs the subtraction of RS2 from RS1'},
    {name: 'SLL',   type: 'R', syntax: 'SLL RD, RS1, RS2',  description: 'SLL performs logical left shifts on the value in RS1 by the shift amount held in the lower 5 bits of RS2'},
    {name: 'SLT',   type: 'R', syntax: 'SLT RD, RS1, RS2',  description: 'SLT perform signed compares respectively, writing 1 to RD if RS1 < RS2, 0 otherwise'},
    {name: 'SLTU',  type: 'R', syntax: 'SLTU RD, RS1, RS2', description: 'SLTU perform unsigned compares respectively, writing 1 to RD if RS1 < RS2, 0 otherwise. Note, SLTU RD, x0, RS2 sets RD to 1 if RS2 is not equal to zero, otherwise sets RD to zero'},
    {name: 'XOR',   type: 'R', syntax: 'XOR RD, RS1, RS2',  description: 'XOR perform bitwise logical XOR between register RS1 and RS2 and puts the result in register RD'},
    {name: 'SRL',   type: 'R', syntax: 'SRL RD, RS1, RS2',  description: 'SRL performs logical right shifts on the value in RS1 by the shift amount held in the lower 5 bits of RS2'},
    {name: 'SRA',   type: 'R', syntax: 'SRA RD, RS1, RS2',  description: 'SLL performs arithmetic right shifts on the value in RS1 by the shift amount held in the lower 5 bits of RS2'},
    {name: 'OR',    type: 'R', syntax: 'OR RD, RS1, RS2',   description: 'OR perform bitwise logical OR between register RS1 and RS2 and puts the result in register RD'},
    {name: 'AND',   type: 'R', syntax: 'AND RD, RS1, RS2',  description: 'AND perform bitwise logical AND between register RS1 and RS2 and puts the result in register RD'},

    // Register-Immediate Instructions
    {name: 'ADDI',   type: 'I', syntax: 'ADDI RD, RS1, imm',  description: 'ADDI add the sign-extended 12-bit immediate to register RS1. Arithmetic overflow is ignored and the result is written in RD'},
    {name: 'SLTI',   type: 'I', syntax: 'SLTI RD, RS1, imm',  description: 'SLTI places the value 1 in register RD if RS1 is less than the sign-extended immediate when both are treated as signed numbers, else 0 is written to RD.'},
    {name: 'SLTIU',  type: 'I', syntax: 'SLTIU RD, RS1, imm', description: 'SLTIU places the value 1 in register RD if RS1 is less than the unsigned immediate when both are treated as unsigned numbers, else 0 is written to RD. Note, SLTIU RD, RS1, 1 sets RD to 1 if RS1 equals zero, otherwise sets RD to 0'},
    {name: 'XORI',   type: 'I', syntax: 'XORI RD, RS1, imm',  description: 'XORI is a logical operation that permorm bitwise XOR on register RS1 and the sign-extended 12-bit immediate and place the result in RD. Note, XORI RD, RS1, -1 performs a bitwise logical inversion of register RS1'},
    {name: 'ORI',    type: 'I', syntax: 'ORI RD, RS1, imm',   description: 'ORI is a logical operation that permorm bitwise OR on register RS1 and the sign-extended 12-bit immediate and place the result in RD'},
    {name: 'ANDI',   type: 'I', syntax: 'ANDI RD, RS1, imm',  description: 'ANDI is a logical operation that permorm bitwise AND on register RS1 and the sign-extended 12-bit immediate and place the result in RD'},
    {name: 'SLLI',   type: 'I', syntax: 'SLLI RD, RS1, imm',  description: 'SLLI is a logical left shift. The operand to be shifted is in RS1, and the amount is encoded in the lower 5 bits of the I-immediate field'},
    {name: 'SRLI',   type: 'I', syntax: 'SRLI RD, RS1, imm',  description: 'SRLI is a logical right shift. The operand to be shifted is in RS1, and the amount is encoded in the lower 5 bits of the I-immediate field'},
    {name: 'SRAI',   type: 'I', syntax: 'SRAI RD, RS1, imm',  description: 'SRAI is an arithmetic right shift (the original sign bit is copied into the vacated upper bits). The operand to be shifted is in RS1, and the amount is encoded in the lower 5 bits of the I-immediate field'},
    // Load Instructions
    {name: 'LB',     type: 'I', syntax: 'LB RD, imm, RS1',    description: 'LB is defined for 8-bit values. Loads copy a value from memory to register RD. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},
    {name: 'LH',     type: 'I', syntax: 'LH RD, imm, RS1',    description: 'LH loads a 16-bit value from memory, then sign-extends to 32-bit before storing in RD. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},
    {name: 'LW',     type: 'I', syntax: 'LW RD, imm, RS1',    description: 'LW loads a 32-bit value from memory into RD. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},
    {name: 'LBU',    type: 'I', syntax: 'LBU RD, imm, RS1',   description: 'LBU is defined for 8-bit values. Loads copy a value from memory to register RD. The effective address is obtained by adding register RS1 to the sign-extend 12-bit offset'},
    {name: 'LHU',    type: 'I', syntax: 'LHU RD, imm, RS1',   description: 'LHU loads a 16-bit value from memory but then zero extends to 32-bit before storing in RD. The effective address is obtained by adding register RS1 to the sign-extend 12-bit offset'},
    // Unconditional Jump
    {name: 'JALR',   type: 'I', syntax: 'JALR RD, RS1, imm',  description: 'JALR jump and link register. The target address is obtained by adding the sign-extended 12-bit I-immediate to the register RS1, then setting the least-significant bit of the result to zero. The address of the instruction following the jump (pc+4) is written in RD'},

    // Store Instructions
    {name: 'SB',     type: 'S', syntax: 'SB RS2, imm, RS1',   description: 'SB stores 8-bit value from the low bits of register RS2 to memory. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},
    {name: 'SH',     type: 'S', syntax: 'SH RS2, imm, RS1',   description: 'SH stores 16-bit value from the low bits of register RS2 to memory. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},
    {name: 'SW',     type: 'S', syntax: 'SW RS2, imm, RS1',   description: 'SW stores 32-bit value from the low bits of register RS2 to memory. The effective address is obtained by adding register RS1 to the sign-extended 12-bit offset'},

    // Conditional Branch Instructions
  //{name: 'B-Type', type: 'B', syntax: 'INSTR RS1, RS2, imm',description: 'In B-type instructions formats the 12-bit B-immediate encodes signed offset in multiples of 2 byte. The offset is sign-extended and added to the address of the branch instruction to give the target address'},
    {name: 'BEQ',    type: 'B', syntax: 'BEQ RS1, RS2, imm',  description: 'BEQ take the branch if registers RS1 and RS2 are equal respectively'},
    {name: 'BNE',    type: 'B', syntax: 'BNE RS1, RS2, imm',  description: 'BNE take the branch if registers RS1 and RS2 are not equal respectively'},
    {name: 'BLT',    type: 'B', syntax: 'BLT RS1, RS2, imm',  description: 'BLT take the branch if registers RS1 is less than RS2, using signed comparison respectively'},
    {name: 'BGE',    type: 'B', syntax: 'BGE RS1, RS2, imm',  description: 'BGE take the branch if registers RS1 is greater than or equal RS2, using signed comparison respectively'},
    {name: 'BLTU',   type: 'B', syntax: 'BLTU RS1, RS2, imm', description: 'BLTU take the branch if registers RS1 is less than RS2, using unsigned comparison respectively'},
    {name: 'BGEU',   type: 'B', syntax: 'BGEU RS1, RS2, imm', description: 'BGEU take the branch if registers RS1 is greater than or equal RS2, using unsigned comparison respectively'},

    // U-type Instructions
    {name: 'LUI',    type: 'U', syntax: 'LUI RD, imm',        description: 'LUI (load upper immediate) is used to build 32-bit constants. LUI places the U-immediate value in the top 20 bits of the destination register RD, filling in the lowest 12 bits with zeros'},
    {name: 'AUIPC',  type: 'U', syntax: 'AUIPC RD, imm',      description: 'AUIPC (add upper immediate to pc) is used to build pc-relative addresses. AUIPC forms a 32-bit offset from the 20-bit U-immediate, filling in the lowest 12 bits with zeros, adds this offset to the address of the AUIPC instructions, then places the result in register RD'},

    // J-type Unconditional Jump
  //{name: 'J-Type', type: 'J', syntax: 'INSTR RD, imm',      description: 'In the J-type format, J-immediate encodes a signed offset in multiples of 2 bytes. The offset is sign-extended and added to the address of the jump instruction to form the jump target address'},
    {name: 'JAL',    type: 'J', syntax: 'JAL RD, imm',        description: 'JAL stores the address of the instruction following the jump (pc+4) into register RD'},
]

import { Documentation } from './documentation.component';

export const DLXDocumentation: Documentation[] = [
    {name: 'ADD',    type: 'R', syntax: 'ADD rd, rs1, rs2',         description: "<h4>Integer Add</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) + ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> are arithmetically added to form a 32&#8209;bit two's complement result, which is then placed into GPR rd. An overflow exception occurs when the result of the addition operation is greater than 2<sup>31</sup> - 1 (i.e., > 0x7FFFFFFF)."},
    {name: 'ADDI',   type: 'I', syntax: 'ADDI rd, rs1, immediate',  description: "<h4>Integer Add Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) + [ ( immediate<sub>0</sub> )<sup>16</sup> || immediate ]</center><br/>The 16&#8209;bit immediate is sign&#8209;extended and arithmetically added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit two's complement result, which is then placed into GPR rd. An overflow exception occurs when the result of the addition operation is greater than 2<sup>31</sup> - 1 (i.e., > 0x7FFFFFFF)."},
    {name: 'ADDU',   type: 'R', syntax: 'ADDU rd, rs1, rs2',        description: "<h4>Integer Add Unsigned</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) + ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> are arithmetically added to form a 32&#8209;bit unsigned result, which is then placed into GPR rd. No overflow exception occurs under any circumstance. As a result, this is the only difference between this instruction and the ADD instruction."},
    {name: 'ADDUI',  type: 'I', syntax: 'ADDUI rd, rs1, immediate', description: "<h4>Integer Add Unsigned Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) + ( '0'<sup>16</sup> || immediate )</center><br/>The 16&#8209;bit immediate is zero&#8209;extended and arithmetically added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned result, which is then placed into GPR rd. As a result, this is the only difference between this instruction and the ADD instruction."},
    {name: 'AND',    type: 'R', syntax: 'AND rd, rs1, rs2',         description: "<h4>Logical And</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) &amp; ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are combined with the contents of GPR rs<sub>2</sub> in a bitwise logical AND operation, and the result is placed into GPR rd."},
    {name: 'ANDI',   type: 'I', syntax: 'ANDI rd, rs1, immediate',  description: "<h4>Logical And Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) &amp; ( '0'<sup>16</sup> || immediate )</center><br/>The 16&#8209;bit immediate is zero&#8209;extended and combined with the contents of GPR rs<sub>1</sub> in a bitwise logical AND operation, and the result is placed into GPR rd."},
    {name: 'BEQZ',   type: 'I', syntax: 'BEQZ rs1, name',           description: "<h4>Branch On Integer Equal To Zero</h4><center>if ( rs<sub>1</sub> ) = 0 then<br/>PC &larr;<sub>32</sub> {[ (PC) + 4 ] + [ ( name<sub>0</sub> )<sup>16</sup> || name ]}</center><br/>The 16&#8209;bit is sign&#8209;extended and added to the address of the instruction in the delay slot to form a 32&#8209;bit branch target address. If the contents of GPR rs<sub>1</sub> are equal to zero, then this branch target address is placed into the program counter."},
    {name: 'BNEZ',   type: 'I', syntax: 'BNEZ rs1, name',           description: "<h4>Branch On Integer Not Equal To Zero</h4><center>if ( rs<sub>1</sub> ) &ne; 0 then<br/>PC &larr;<sub>32</sub> {[ (PC) + 4 ] + [ ( name<sub>0</sub> )<sup>16</sup> || name ]}</center><br/>The 16&#8209;bit is sign&#8209;extended and added to the address of the instruction in the delay slot to form a 32&#8209;bit branch target address. If the contents of GPR rs<sub>1</sub> are not equal to zero, then this branch target address is placed into the program counter."},
    {name: 'J',      type: 'J', syntax: 'J name',                   description: "<h4>Jump</h4><center>PC &larr;<sub>32</sub> {[ (PC) + 4 ] + [ ( name<sub>0</sub> )<sup>16</sup> || name ]}</center><br/>The 26&#8209;bit name is sign&#8209;extended and added to the address of the instruction in the delay slot to form a 32&#8209;bit target address. This target address is unconditionally placed into the program counter."},
    {name: 'JAL',    type: 'J', syntax: 'JAL name',                 description: "<h4>Jump And Link</h4><center>R31 &larr;<sub>32</sub> [ (PC) + 8 ]<br/>PC &larr;<sub>32</sub> {[ (PC) + 4 ] + [ ( name<sub>0</sub> )<sup>16</sup> || name ]}</center><br/>The 26&#8209;bit name is sign&#8209;extended and added to the address of the instruction in the delay slot to form a 32&#8209;bit target address. This target address is unconditionally placed into the program counter. The address of the instruction after the delay slot is placed into GPR R31."},
    {name: 'JALR',   type: 'I', syntax: 'JALR rs1',                 description: "<h4>Jump And Link Register</h4><center>R31 &larr;<sub>32</sub> [ (PC) + 8 ]<br/>PC &larr;<sub>32</sub> ( rs<sub>1</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are considered to be target address, and they are unconditionally placed into the program counter. The address of the instruction after the delay slot is placed into GPR R31."},
    {name: 'JR',     type: 'I', syntax: 'JR rs1',                   description: "<h4>Jump Register</h4><center>PC &larr;<sub>32</sub> ( rs<sub>1</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are considered to be target address, and they are unconditionally placed into the program counter."},
    {name: 'LB',     type: 'I', syntax: 'LB rd, offset(rs1)',       description: "<h4>Load Byte</h4><center>rd &larr;<sub>32</sub> { M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}<sub>0</sub> }<sup>24</sup><br/>|| M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of the byte in memory at this effective address are sign&#8209;extended and loaded into GPR rd."},
    {name: 'LBU',    type: 'I', syntax: 'LBU rd, offset(rs1)',      description: "<h4>Load Byte Unsigned</h4><center>rd &larr;<sub>32</sub> '0' <sup>24</sup> || M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of the byte in memory at this effective address are zero&#8209;extended and loaded into GPR rd."},
    {name: 'LH',     type: 'I', syntax: 'LH rd, offset(rs1)',       description: "<h4>Load Halfword</h4><center>rd &larr;<sub>32</sub> { M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}<sub>0</sub> }<sup>16</sup><br/>|| M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of the halfword in memory at this effective address are sign&#8209;extended and loaded into GPR rd."},
    {name: 'LHI',    type: 'I', syntax: 'LHI rd, immediate',        description: "<h4>Load High Immediate</h4><center>rd &larr;<sub>32</sub> immediate || '0'<sup>16</sup></center><br/>The 16&#8209;bit immediate is concatenated with 16 zero&#8209;bits, and the result is placed into GPR rd."},
    {name: 'LHU',    type: 'I', syntax: 'LHU rd, offset(rs1)',      description: "<h4>Load Halfword Unsigned</h4><center>rd &larr;<sub>32</sub> '0' <sup>16</sup> || M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of the halfword in memory at this effective address are zero&#8209;extended and loaded into GPR rd."},
    {name: 'LW',     type: 'I', syntax: 'LW rd, offset(rs1)',       description: "<h4>Load Word</h4><center>rd &larr;<sub>32</sub> M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )}</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of the word in memory at this effective address are loaded into GPR rd."},
    {name: 'MOVI2S', type: 'R', syntax: 'MOVI2S rd, rs1',           description: "<h4>Move From GPR To Special Register</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are loaded into special register rd."},
    {name: 'MOVS2I', type: 'R', syntax: 'MOVS2I rd, rs1',           description: "<h4>Move From Special Register To GPR</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> )</center><br/>The contents of special register rs<sub>1</sub> are loaded into GPR rd."},
    {name: 'NOP',    type: 'R', syntax: 'NOP',                      description: "<h4>No Operation</h4><center>(none)</center><br/>No operation is performed."},
    {name: 'OR',     type: 'R', syntax: 'OR rd, rs1, rs2',          description: "<h4>Logical Or</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) | ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are combined with the contents of GPR rs<sub>2</sub> in a bitwise logical OR operation, and the result is placed into GPR rd."},
    {name: 'ORI',    type: 'I', syntax: 'ORI rd, rs1, immediate',   description: "<h4>Logical Or Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) | ( '0'<sup>16</sup> || immediate )</center><br/>The 16&#8209;bit immediate is zero&#8209;extended and combined with the contents of GPR rs<sub>1</sub> in a bitwise logical OR operation, and the result is placed into GPR rd."},
    {name: 'RFE',    type: 'J', syntax: 'RFE',                      description: "<h4>Return From Exception</h4><center>PC &larr;<sub>32</sub> (IAR)</center><br/>The contents of special register IAR are considered to be the target address, and they are unconditionally placed into the program counter."},
    {name: 'SB',     type: 'I', syntax: 'SB offset(rs1), rd',       description: "<h4>Store Byte</h4><center>M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )} &larr;<sub>8</sub> (rd)<sub>24..31</sub></center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The least significant byte of the contents of GPR rd is stored at this effective address."},
    {name: 'SEQ',    type: 'R', syntax: 'SEQ rd, rs1, rs2',         description: "<h4>Set On Equal To</h4><center>if ( rs<sub>1</sub> ) = ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SEQI',   type: 'I', syntax: 'SEQI rd, rs1, immediate',  description: "<h4>Set On Equal To Immediate</h4><center>if ( rs<sub>1</sub> ) = ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SGE',    type: 'R', syntax: 'SGE rd, rs1, rs2',         description: "<h4>Set On Greater Than Or Equal To</h4><center>if ( rs<sub>1</sub> ) &ge; ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is greater than or equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SGEI',   type: 'I', syntax: 'SGEI rd, rs1, immediate',  description: "<h4>Set On Greater Than Or Equal To Immediate</h4><center>if ( rs<sub>1</sub> ) &ge; ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is greater than or equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SGT',    type: 'R', syntax: 'SGT rd, rs1, rs2',         description: "<h4>Set On Greater Than</h4><center>if ( rs<sub>1</sub> ) &gt; ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is greater than the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SGTI',   type: 'I', syntax: 'SGTI rd, rs1, immediate',  description: "<h4>Set On Greater Than Immediate</h4><center>if ( rs<sub>1</sub> ) &gt; ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is greater than the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SH',     type: 'I', syntax: 'SH offset(rs1), rd',       description: "<h4>Store Halfword</h4><center>M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )} &larr;<sub>16</sub> (rd)<sub>16..31</sub></center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The least significant halfword of the contents of GPR rd is stored at this effective address."},
    {name: 'SLE',    type: 'R', syntax: 'SLE rd, rs1, rs2',         description: "<h4>Set On Less Than Or Equal Than</h4><center>if ( rs<sub>1</sub> ) &le; ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is less than or equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SLEI',   type: 'I', syntax: 'SLEI rd, rs1, immediate',  description: "<h4>Set On Less Than Or Equal Than Immediate</h4><center>if ( rs<sub>1</sub> ) &le; ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is less than or equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SLL',    type: 'R', syntax: 'SLL rd, rs1, rs2',         description: "<h4>Shift Left Logical</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> )<sub>shamt..31</sub> || '0'<sup>shamt</sup><br/>where shamt = ( rs<sub>2</sub> )<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of the contents of GPR rs<sub>2</sub>, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SLLI',   type: 'I', syntax: 'SLLI rd, rs1, immediate',  description: "<h4>Shift Left Logical Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> )<sub>shamt..31</sub> || '0'<sup>shamt</sup><br/>where shamt = immediate<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of immediate, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SLT',    type: 'R', syntax: 'SLT rd, rs1, rs2',         description: "<h4>Set On Less Than</h4><center>if ( rs<sub>1</sub> ) &lt; ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is less than the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SLTI',   type: 'I', syntax: 'SLTI rd, rs1, immediate',  description: "<h4>Set On Less Than Immediate</h4><center>if ( rs<sub>1</sub> ) &lt; ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is less than the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SNE',    type: 'R', syntax: 'SNE rd, rs1, rs2',         description: "<h4>Set On Not Equal To</h4><center>if ( rs<sub>1</sub> ) &ne; ( rs<sub>2</sub> ) then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the contents of GPR rs<sub>2</sub> as 32&#8209;bit two's complement integers, if the former is not equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SNEI',   type: 'I', syntax: 'SNEI rd, rs1, immediate',  description: "<h4>Set On Not Equal To Immediate</h4><center>if ( rs<sub>1</sub> ) &ne; ( immediate<sub>0</sub> )<sup>16</sup> || immediate<br/>then rd &larr;<sub>32</sub> ( '0'<sup>31</sup> || '1' )<br/>else rd &larr;<sub>32</sub> ( '0'<sup>32</sup> )</center><br/>Treating the contents of GPR rs<sub>1</sub> and the sign&#8209;extended 16&#8209;bit immediate as 32&#8209;bit two's complement integers, if the former is not equal to the latter, the result is set to one, otherwise the result is set to zero. This 32&#8209;bit result is placed into GPR rd"},
    {name: 'SRA',    type: 'R', syntax: 'SRA rd, rs1, rs2',         description: "<h4>Shift Right Arithmetic</h4><center>rd &larr;<sub>32</sub> [( rs<sub>1</sub> )<sub>0</sub> ]<sup>shamt</sup> || ( rs<sub>1</sub> )<sub>0..[31-shamt]</sub><br/>where shamt = ( rs<sub>2</sub> )<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of the contents of GPR rs<sub>2</sub>, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SRAI',   type: 'I', syntax: 'SRAI rd, rs1, immediate',  description: "<h4>Shift Right Arithmetic Immediate</h4><center>rd &larr;<sub>32</sub> [( rs<sub>1</sub> )<sub>0</sub> ]<sup>shamt</sup> || ( rs<sub>1</sub> )<sub>0..[31-shamt]</sub><br/>where shamt = immediate<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of immediate, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SRL',    type: 'R', syntax: 'SRL rd, rs1, rs2',         description: "<h4>Shift Right Logical</h4><center>rd &larr;<sub>32</sub> '0'<sup>shamt</sup> || ( rs<sub>1</sub> )<sub>0..[31-shamt]</sub><br/>where shamt = ( rs<sub>2</sub> )<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of the contents of GPR rs<sub>2</sub>, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SRLI',   type: 'I', syntax: 'SRLI rd, rs1, immediate',  description: "<h4>Shift Right Logical Immediate</h4><center>rd &larr;<sub>32</sub> '0'<sup>shamt</sup> || ( rs<sub>1</sub> )<sub>0..[31-shamt]</sub><br/>where shamt = immediate<sub>27..31</sub></center><br/>The contents of GPR rs<sub>1</sub> are shifted left by the number of bits specified by the five low-order bits of immediate, inserting zeroes into the low-order bits, and the 32&#8209;bit result is placed into GPR rd."},
    {name: 'SUB',    type: 'R', syntax: 'SUB rd, rs1, rs2',         description: "<h4>Integer Subtract</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) - ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>2</sub> are arithmetically subtracted from the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit two's complement result, which is then placed into GPR rd. An overflow exception occurs when the result of the subtraction operation is less than -2<sup>31</sup> - 1 (i.e., < 0x80000000)."},
    {name: 'SUBI',   type: 'I', syntax: 'SUBI rd, rs1, immediate',  description: "<h4>Integer Subtract Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) - [ ( immediate<sub>0</sub> )<sup>16</sup> || immediate ]</center><br/>The 16&#8209;bit immediate is sign&#8209;extended and arithmetically subtracted from the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit two's complement result, which is then placed into GPR rd. An overflow exception occurs when the result of the subtraction operation is less than -2<sup>31</sup> - 1 (i.e., < 0x80000000)."},
    {name: 'SUBU',   type: 'R', syntax: 'SUBU rd, rs1, rs2',        description: "<h4>Integer Subtract Unsigned</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) - ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>2</sub> are arithmetically subtracted from the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned result, which is then placed into GPR rd. No overflow exception occurs under any circumstance. As a result, this is the only difference between this instruction and the SUB instruction."},
    {name: 'SUBUI',  type: 'I', syntax: 'SUBUI rd, rs1, immediate', description: "<h4>Integer Subtract Unsigned Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) - ( '0'<sup>16</sup> || immediate )</center><br/>The 16&#8209;bit immediate is zero&#8209;extended and arithmetically subtracted from the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned result, which is then placed into GPR rd. As a result, this is the only difference between this instruction and the SUBI instruction."},
    {name: 'SW',     type: 'I', syntax: 'SW offset(rs1), rd',       description: "<h4>Store Word</h4><center>M{[( offset<sub>0</sub> )<sup>16</sup> || offset ] + ( rs<sub>1</sub> )} &larr;<sub>32</sub> (rd)</center><br/>The 16&#8209;bit offset is sign&#8209;extended and added to the contents of GPR rs<sub>1</sub> to form a 32&#8209;bit unsigned effective address. The contents of GPR rd are stored at this effective address."},
    {name: 'TRAP',   type: 'J', syntax: 'TRAP name',                description: "<h4>Trap</h4><center>IAR &larr;<sub>32</sub> [(PC) + 8]<br/>PC &larr;<sub>32</sub> '0'<sup>6</sup> || name</center><br/>The 26&#8209;bit name is zero&#8209;extended and added to the address of the instruction in the delay slot to form a 32&#8209;bit target address. This target address is unconditionally placed into the program counter. The address of the instruction after the delay slot is placed into the special register IAR."},
    {name: 'XOR',    type: 'R', syntax: 'XOR rd, rs1, rs2',         description: "<h4>Logical Xor</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) &oplus; ( rs<sub>2</sub> )</center><br/>The contents of GPR rs<sub>1</sub> are combined with the contents of GPR rs<sub>2</sub> in a bitwise logical XOR operation, and the result is placed into GPR rd."},
    {name: 'XORI',   type: 'I', syntax: 'XORI rd, rs1, immediate',  description: "<h4>Logical Xor Immediate</h4><center>rd &larr;<sub>32</sub> ( rs<sub>1</sub> ) &oplus; ( '0'<sup>16</sup> || immediate )</center><br/>The 16&#8209;bit immediate is zero&#8209;extended and combined with the contents of GPR rs<sub>1</sub> in a bitwise logical XOR operation, and the result is placed into GPR rd."},
]
import { Interpreter } from './interpreter';
import { Registri } from '../registri/registri';

export class RV32Interpreter extends Interpreter {
    run(line : string, registri: Registri) : void {
        const R = "ADD_SUB_SLL_SLT_SLTU_XOR_SRL_SRA_OR_AND";
        const I = "ADDI_SLTI_SLTIU_XORI_ORI_ANDI_SLLI_SRLI_SRAI_LB_LH_LW_LBU_LHU";
        const I_J ="JALR";
        const S = "SB_SH_SW";
        const B = "BEQ_BNE_BLT_BGE_BLTU_BGEU"
        const U = "LUI_AUIPC";
        const J = "JAL";
        
        console.log("RV32I: " + line);
        
    }
}
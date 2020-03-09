import { DLXDocumentation } from 'src/app/documentation/dlx.documentation';
import { Memory } from 'src/app/memory/model/memory';
import { DLXRegisters } from '../../registers/dlx.registers';
import { Registers } from '../../registers/registers';
import { Interpreter } from '../interpreter';
import { NotExistingInstructionError, WrongArgumentsError } from '../interpreter-errors';
import { encoder, inputs_encoder } from './dlx.encoder';
import { instructions, InstructionType, signExtend, specialRegisters } from './dlx.instructions';
export class DLXInterpreter extends Interpreter{

    private readonly process_instruction: {
        [key in InstructionType]: 
            (line: string, instruction: string, args: number[], func: (registers: DLXRegisters, args?: number[]) => number, registers: DLXRegisters, memory?: Memory, unsigned?: boolean) => void
    } = {
        R: (line, instruction, [rd, rs1, rs2], func, registers) => {
            if (!(/\w+\s+R[123]?\d\s*,\s*R[123]?\d\s*,\s*R[123]?\d/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            registers.temp = registers.b = registers.r[rs2];
            try {
                func(registers);
            } catch(e) {
                this.handleOverflow(e, registers);
            }
            if (rd) {
                registers.r[rd] = registers.c;
            }
        },
        RM: (_line, _instruction, args, func, registers) => {
            func(registers, args);
        },
        I: (line, instruction, [rd, rs1, immediate], func, registers, _memory, unsigned = false) => {
            if (!(/\w+\s+R[123]?\d\s*,\s*R[123]?\d\s*,\s*0x([0-9A-F]{4})/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            registers.b = registers.r[rd];
            registers.temp = unsigned ? immediate : signExtend(immediate);
            try {
                func(registers);
            } catch(e) {
                this.handleOverflow(e, registers);
            }
            if (rd) {
                registers.r[rd] = registers.c;
            }
        },
        IB: (line, instruction, [rs1, name], func, registers) => {
            if (!(/\w+\s+R[123]?\d\s*,\s*\w+/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            registers.temp = name;
            func(registers);
        },
        IJ: (line, instruction, [rs1], func, registers) => {
            if (!(/\w+\s+R[123]?\d/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            func(registers);
        },
        IL: (line, instruction, [rd, offset, rs1], func, registers, memory) => {
            if (!(/\w+\s+R[123]?\d\s*,\s*0x([0-9A-F]{4})\s*\(\s*R[123]?\d\s*\)\s*/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            registers.b = registers.r[rd];
            registers.mar = signExtend(offset) + registers.a;
            let addr = Math.floor((registers.mar >>> 0) / 4) >>> 0;
            registers.mdr = memory.load(addr);
            registers.temp = offset;
            func(registers);
            if (rd) {
                registers.r[rd] = registers.c;
            }
        },
        IS: (line, instruction, [offset, rs1, rd], func, registers, memory) => {
            if (!(/\w+\s+0x([0-9A-F]{4})\s*\(\s*R[123]?\d\s*\)\s*,\s*R[123]?\d/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.a = registers.r[rs1];
            registers.mdr = registers.b = registers.r[rd];
            registers.mar = signExtend(offset) + registers.a;
            registers.temp = offset;
            let addr = Math.floor((registers.mar >>> 0) / 4) >>> 0;
            memory.store(addr, func(registers, [memory.load(addr)]));
        },
        J: (line, instruction, [name], func, registers, _memory, unsigned = false) => {
            if (!(/\w+\s+\w+/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.temp = unsigned ? name : signExtend(name, 26);
            func(registers);
        },
        LHI: (line, instruction, [rd, immediate], func, registers) => {
            if (!(/\w+\s+R[123]?\d\s*,\s*0x([0-9A-F]{4})/i.test(line))) throw new WrongArgumentsError(instruction, DLXDocumentation);
            registers.temp = immediate;
            func(registers);
            if (rd) {
                registers.r[rd] = registers.c;
            }
        },
        NOP: () => {},
        RFE: (_line, instruction, args, func, registers) => {
            if (args.length) throw new WrongArgumentsError(instruction, DLXDocumentation);
            func(registers);
            this.interruptEnabled = true;
        }
    }

    private handleOverflow(e: Error, registers: DLXRegisters) {
        if (['overflow', 'fault'].includes(e.message)) {
            this.interruptEnabled = false;
            (registers as DLXRegisters).iar = registers.pc;
            registers.pc = 0;
        } else {
            throw e;
        }
    }

    private processLine(line: string): [string, number[], string]{
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

        if (instructions[instruction]) {
            argsFixed = args.map<number>(arg => {
                if (arg.match(/^R[123]?\d/i)) {
                    return parseInt(arg.substr(1));
                } else if (specialRegisters.includes(arg.toUpperCase())) {
                    return specialRegisters.indexOf(arg.toUpperCase()) + 1;
                } else if (arg.match(/^0x([0-9A-F]{4})/i)) {
                    return parseInt(arg.substr(2, 4), 16);
                } else if (this.tags[arg]) {
                    return this.tags[arg];
                } else if (arg) 
                    if (['IB', 'J'].includes(instructions[instruction].type)) 
                        throw new Error("the tag doesn't exist")
                    else
                        throw new WrongArgumentsError(instruction, DLXDocumentation);
            });
        } else if (instruction) {
            throw new NotExistingInstructionError(instruction);
        }

        return [instruction, argsFixed, lineFixed];
    }

    public run(line: string, registers: Registers, memory: Memory): void {
        let [instruction, argsFixed, lineFixed] = this.processLine(line);

        let inst = instructions[instruction];
        if(inst) {
            let [opcode, alucode] = encoder[instruction];

            (registers as DLXRegisters).ir = parseInt(opcode + inputs_encoder[inst.type](argsFixed) + alucode, 2);
            this.process_instruction[inst.type](lineFixed, instruction, argsFixed, inst.func, registers as DLXRegisters, memory, inst.unsigned);
        }
    }

    public encode(line: string): number {
        try {
            let [instruction, argsFixed] = this.processLine(line);
            let inst = instructions[instruction];
            let [opcode, alucode] = encoder[instruction];
            return parseInt(opcode + inputs_encoder[inst.type](argsFixed) + alucode, 2)
        } catch(error) {
            return 0;
        }
    }

    public interrupt(registers: Registers): void {
        if (this.interruptEnabled) {
            (registers as DLXRegisters).iar = registers.pc;
            registers.pc = 0;
            this.interruptEnabled = false;
        }
    }
}

import { Interpreter } from '../interpreter';
import { Registri } from '../../registri/registri';
import { DLXRegistri } from '../../registri/dlx.registri';
import { Memory } from 'src/app/memory/memory';
import { decoder, inputs_decoder } from './dlx.decoder';
import { instructions, InstructionType, signExtend } from './dlx.instructions';
export class DLXInterpreter extends Interpreter{

    readonly process_instruction: {
        [key in InstructionType]: 
            (args: number[], func: (registers: DLXRegistri, args?: number[]) => number, registers: DLXRegistri, memory?: Memory, unsigned?: boolean) => void
    } = {
        R: ([rd, rs1, rs2], func, registers) => {
            registers.a = registers.r[rs1];
            registers.temp = registers.b = registers.r[rs2];
            func(registers);
            registers.r[rd] = registers.c;
        },
        RM: (args, func, registers) => {
            func(registers, args);
        },
        I: ([rd, rs1, immediate], func, registers, _memory, unsigned = false) => {
            registers.a = registers.r[rs1];
            registers.b = registers.r[rd];
            registers.temp = unsigned ? immediate : signExtend(immediate);
            func(registers);
            registers.r[rd] = registers.c;
        },
        IB: ([rs1, name], func, registers) => {
            registers.a = registers.r[rs1];
            registers.temp = name;
            func(registers);
        },
        IJ: ([rs1], func, registers) => {
            registers.a = registers.r[rs1];
            func(registers);
        },
        IL: ([rd, offset, rs1], func, registers, memory) => {
            registers.a = registers.r[rs1];
            registers.b = registers.r[rd];
            registers.mar = Math.floor((signExtend(offset) + registers.a) / 4);
            registers.mdr = memory.load(registers.mar);
            registers.temp = offset;
            func(registers);
            registers.r[rd] = registers.c;
        },
        IS: ([offset, rs1, rd], func, registers, memory) => {
            registers.a = registers.r[rs1];
            registers.mdr = registers.b = registers.r[rd];
            registers.mar = Math.floor((signExtend(offset) + registers.a) / 4);
            registers.temp = offset;
            memory.store(registers.mar, func(registers, [memory.load(registers.mar)]));
        },
        J: ([name], func, registers, _memory, unsigned = false) => {
            registers.temp = unsigned ? name : signExtend(name, 26);
            func(registers);
        },
        LHI: ([rd, immediate], func, registers) => {
            registers.temp = immediate;
            func(registers);
            registers.r[rd] = registers.c;
        },
        NOP: () => {},
        RFE: (_args, func, registers) => {
            func(registers);
        }
    }

    run(line: string, registers: Registri, memory: Memory): void {
        let tokens: string[];

        if (!line || line.match(/^;/)) {
            tokens = ['NOP'];
        } else {
            tokens = line.split(';')[0].split(/\W+/);
            if (!tokens[0] || line.match(/\w+:/)) tokens.shift();
        }

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

        if (instructions[instruction]) {
            let inst = instructions[instruction];
            let [opcode, alucode] = decoder[instruction];

            (registers as DLXRegistri).ir = parseInt(opcode + inputs_decoder[inst.type](argsFixed) + alucode, 2);
            this.process_instruction[inst.type](argsFixed, inst.func, registers as DLXRegistri, memory, inst.unsigned);
        }
    }
}
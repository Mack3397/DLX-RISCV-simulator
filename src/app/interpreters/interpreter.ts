import { Registri } from '../registri/registri';

export abstract class Interpreter {
    abstract run(line: string, registri: Registri, memory: number[]): void;
}

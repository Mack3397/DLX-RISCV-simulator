import { Interpreter } from './interpreter';
import { Registri } from '../registri/registri';

export class DLXInterpreter extends Interpreter{
    run(line: string, registri: Registri): void {
        console.log("dlx: "+line);
    }
}

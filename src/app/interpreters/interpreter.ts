import { Registers } from '../registers/registers';
import { Memory } from '../memory/model/memory';

export abstract class Interpreter {

    protected interruptEnabled: boolean = true;

    //dizionario tag -> numero riga
    protected tags: {[key: string]: number} = {};

    abstract run(line: string, registers: Registers, memory: Memory): void;

    abstract decode(line: string): number;

    abstract interrupt(registers: Registers): void;

    parseTags(code: string, startTag: string) {
        code.split('\n').forEach((line, index) => {
            let tag = /^(\w+):/.exec(line);
            if (tag) {
                this.tags[tag[1]] = index * 4;
            }
        });
        this.tags['start_tag'] = this.tags[startTag];
    }

    getTag(name: string): number {
        return this.tags[name];
    }

}

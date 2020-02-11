import { Registri } from '../registri/registri';
import { Memory } from '../memory/model/memory';

export abstract class Interpreter {

    //dizionario tag -> numero riga
    protected tags: {[key: string]: number} = {};

    abstract run(line: string, registri: Registri, memory: Memory): void;

    abstract decode(line: string): number;

    parseTags(code: string) {
        code.split('\n').forEach((line, index) => {
            let tag = /^(\w+):/.exec(line);
            if (tag) {
                this.tags[tag[1]] = index * 4;
            }
        });
        console.log(this.tags)
    }

}

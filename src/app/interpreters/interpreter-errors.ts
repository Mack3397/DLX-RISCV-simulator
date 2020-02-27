import { DLXDocumentation } from '../documentation/dlx.documentation';

export class NotExistingInstructionError extends Error {
    constructor(instruction: string) {
        super('The instruction ' + instruction + " doesn't exist"); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export class WrongArgumentsError extends Error {
    constructor(instruction: string) {
        super('Wrong arguments: ' + DLXDocumentation.find(doc => doc.name == instruction).syntax); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

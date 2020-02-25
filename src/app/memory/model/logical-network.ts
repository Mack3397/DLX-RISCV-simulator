import { Device } from "./device"
/**
 * standard logical network
 */ 
export class LogicalNetwork extends Device {

    ffd: boolean;

    public a_set() {
        this.ffd = true;
    }

    public a_reset() {
        this.ffd = false;
    }
}

import { LogicalNetwork } from './logical-network';
import { Injector } from '@angular/core';

export class StartLogicalNetwork extends LogicalNetwork {
    //ffd( name, d, a_res, a_set, clk)
    //mux( zero, one, sel)
    //tri( in, en )
    //bd0 = tri( ffd( start, mux( start.q, bd0, cs_write ), reset, null, memwr* ), cs_read )";

    constructor(cs_read: number, cs_write: number, injector: Injector) {
        super('Start', cs_read, cs_write);
    }

    public load(address: number): number {
        if (address == this.min_address) {
            return this.ffd ? 1 : 0;
        }
        return 0;
    }
    
    public store(address: number, word: number): void {
        if (address == this.max_address) {
            this.ffd = (word & 0x1) == 0x1;
        }
    }
}

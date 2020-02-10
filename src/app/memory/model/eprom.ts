import { Device } from './device';
import { Injector } from '@angular/core';
import { CodeService } from 'src/app/services/code.service';

export class Eprom extends Device {
    private codeService: CodeService;
    
    public get min_address() : number {
        return 0;
    }
    
    public set min_address(v : number) {}
    
    constructor(min_address: number, max_address: number, injector: Injector) {
        super('EPROM', min_address, max_address);
        this.codeService = injector.get(CodeService);
    }

    public load(address: number): number {
        return this.codeService.dlxDecode(address);
    }

    public store(address: number, word: number): void {}
}

import { Device } from './device';
import { Injector } from '@angular/core';
import { CodeService } from 'src/app/services/code.service';

export class Eprom extends Device {
    private codeService: CodeService;

    constructor(min_address: number, max_address: number, injector: Injector) {
        super('EPROM', min_address, max_address);
        this.codeService = injector.get(CodeService);
        this.codeService.log();
    }
}

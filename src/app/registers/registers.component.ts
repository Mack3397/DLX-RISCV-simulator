import { Component, Input } from '@angular/core';
import { DLXRegisters } from './dlx.registers';
import { Registers } from './registers';
import { RV32IRegisters } from './rv32i.registers';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.sass']
})
export class RegistersComponent {

  @Input() registers: Registers;

  fType: 'dec'|'bin'|'hex' = 'hex'

  get dlxRegisters(): DLXRegisters {
    return this.registers as DLXRegisters;
  }

  get rv32iRegisters(): RV32IRegisters {
    return this.registers as RV32IRegisters;
  }

  get isDLX(): boolean {
    return this.registers.constructor.name === DLXRegisters.name;
  }

  get isRV32I(): boolean {
    return this.registers.constructor.name === RV32IRegisters.name;
  }

  constructor() { }

}

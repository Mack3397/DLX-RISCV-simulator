import { Component, Input, OnInit } from '@angular/core';
import { Registers } from './registers';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.sass']
})
export class RegistersComponent implements OnInit {

  @Input() registers: Registers;

  fType: 'dec'|'bin'|'hex' = 'hex'

  get isDLX() {
    return this.registers.constructor.name === 'DLXRegisters';
  }

  get isRV32I() {
    return this.registers.constructor.name === 'RV32IRegisters';
  }

  constructor() { }

  ngOnInit() {
  }

}

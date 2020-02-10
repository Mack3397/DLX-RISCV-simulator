import { Injectable } from '@angular/core';
import { inputs_decoder, decoder } from '../interpreters/dlx/dlx.decoder';
import { instructions } from '../interpreters/dlx/dlx.instructions';
import { DLXInterpreter } from '../interpreters/dlx/dlx.interpreter';
import { Interpreter } from '../interpreters/interpreter';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  
  public content: string;
  public interpreter: Interpreter;

  constructor() { 
    this.content = window.localStorage.getItem('code') || 'main: '
  }

  save() {
    window.localStorage.setItem('code', this.content);
  }

  dlxDecode(lineN: number): number {
    let [instruction, argsFixed] = (this.interpreter as DLXInterpreter).processLine(this.content.split('\n')[lineN]);
    let inst = instructions[instruction];
    let [opcode, alucode] = decoder[instruction];
    return parseInt(opcode + inputs_decoder[inst.type](argsFixed) + alucode, 2)
  }

  log() {
    console.log('ciao');
  }
}

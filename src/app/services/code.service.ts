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
    return this.interpreter.decode(this.content.split('\n')[lineN]);
  }

  log() {
    console.log('ciao');
  }
}

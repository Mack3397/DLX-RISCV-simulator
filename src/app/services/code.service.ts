import { Injectable } from '@angular/core';
import { Interpreter } from '../interpreters/interpreter';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  
  public content: string;
  public interpreter: Interpreter;
  public editorMode: string;

  constructor() {}

  load() {
    this.content = window.localStorage.getItem(`code-${this.editorMode}`) ||
      (this.editorMode == 'dlx' ? 
        'LHI R29, 0xC000; cs_read_start\nLB R30, 0x0000(R29)\nBEQZ R30, handler; if start == 0 then jump to interrupt handler\nSB 0x0004(R29), R0; set start to 0\nJ start_tag; jump to start tag defined under this window\n\nhandler: LHI R30, 0x0AB0\n         RFE\n\nmain: '
      : 'main: ')
    ;
  }

  save() {
    window.localStorage.setItem(`code-${this.editorMode}`, this.content);
  }

  dlxDecode(lineN: number): number {
    return this.interpreter.decode(this.content.split('\n')[lineN]);
  }

  log() {
    console.log('ciao');
  }
}

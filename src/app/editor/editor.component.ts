import 'codemirror/addon/selection/active-line'
import './modes/dlx.js';
import './modes/rv32i.js';
import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { EditorFromTextArea } from 'codemirror';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements AfterViewInit, OnChanges {

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  @Input() mode: string;

  @Input() pc: number = 0;
  @Output() pcChange: EventEmitter<number> = new EventEmitter();

  @Output() runLine: EventEmitter<string> = new EventEmitter();
  @Output() doParseTags: EventEmitter<string> = new EventEmitter();

  private prePc: number = 0;
  private running: boolean = false;
  content: string = '      ADDI R1, R0, 0008h\nloop: ADD R2, R2, R1\n      SUBI R1, R1, 0001h\n      BNEZ R1, loop';

  set start(val: string) {
    this.pcChange.emit(parseInt(val, 16));
  }

  get start() {
    return this.pc.toString(16);
  }

  get options() {
    return {
      lineNumbers: true,
      firstLineNumber: 0,
      lineNumberFormatter: (line: number) => (line * 4).toString(16),
      theme: 'darktheme',
      mode: this.mode,
      styleActiveLine: true
    }
  }

  get doc(): EditorFromTextArea {
    return this.codeEditor && this.codeEditor.codeMirror;
  }
  
  get currentLine(): number {
    return this.pc / 4;
  }

  set currentLine(val: number) {
    this.pc = val * 4;
    this.pcChange.emit(this.pc);
  }

  get isRunDisabled(): boolean {
    if(this.doc)
      return this.currentLine >= this.doc.lineCount();
    else
      return false;
  }

  get isStopDisabled(): boolean {
    return !this.running;
  }

  constructor() { }

  ngAfterViewInit() {
    this.doc.on("change", (event) => this.onStop());
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (this.doc) {
      let pre = Math.floor(changes.pc.previousValue / 4);
      let cur = Math.floor(changes.pc.currentValue / 4);
      if (!this.running) {
        this.doc.removeLineClass(this.prePc, 'wrap', 'runned');
        this.doc.removeLineClass(pre, 'wrap', 'next');
      } else if (changes.pc) {
        this.doc.removeLineClass(this.prePc, 'wrap', 'runned');
        this.doc.removeLineClass(pre, 'wrap', 'next');
        this.doc.addLineClass(pre, 'wrap', 'runned');
        if (cur < this.doc.lineCount()) {
          this.doc.addLineClass(cur, 'wrap', 'next');
        }
        this.prePc = pre;
      }
    }
  }

  onRun() {
    this.currentLine++;
    if (!this.running) {
      this.doParseTags.emit(this.content);
      this.running = true;
    }
    this.runLine.emit(this.doc.getLine(this.currentLine - 1));
  }

  onStop() {
    this.currentLine = 0;
    this.running = false;
  }

}

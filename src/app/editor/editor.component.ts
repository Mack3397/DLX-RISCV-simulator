import 'codemirror/addon/selection/active-line'
import './modes/dlx.js';
import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { EditorFromTextArea } from 'codemirror';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  @Input() mode: string;

  @Input() pc: number = 0;
  @Output() pcChange: EventEmitter<number> = new EventEmitter();

  @Output() runLine: EventEmitter<string> = new EventEmitter();

  private running: boolean = false;

  content: string = 'ADDI R1, R0, 80F8h\nLHI R1, 7FFFh\nLHI R2, 7FFFh\nADD R3, R1, R2 ;commento\n';

  get options() {
    return {
      lineNumbers: true,
      firstLineNumber: 0,
      lineNumberFormatter: (line: number) => line * 4,
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

  onRun() {
    if (this.currentLine > 0)
      this.doc.removeLineClass(this.currentLine - 1, 'wrap', 'running');
    this.doc.addLineClass(this.currentLine, 'wrap', 'running');
    this.currentLine++;
    this.running = true;
    this.runLine.emit(this.doc.getLine(this.currentLine - 1));
  }

  onStop() {
    this.doc.removeLineClass(this.currentLine - 1, 'wrap', 'running');
    this.doc.removeLineClass(this.currentLine, 'wrap', 'running');
    this.currentLine = 0;
    this.running = false;
  }

}

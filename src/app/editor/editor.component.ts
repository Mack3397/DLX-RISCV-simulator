import 'codemirror/addon/selection/active-line'
import './modes/dlx.js';
import './modes/rv32i.js';
import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { EditorFromTextArea } from 'codemirror';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  @Input() mode: string;

  private _pc: number;
  @Output() pcChange: EventEmitter<number> = new EventEmitter();

  @Output() runLine: EventEmitter<string> = new EventEmitter();
  @Output() doParseTags: EventEmitter<string> = new EventEmitter();

  private previousLine: number = 0;
  private runnedLine: number = 0;
  private running: boolean = false;
  start: string = 'main';
  content: string = '';

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

  get pc(): number {
    return this._pc;
  }

  @Input() 
  set pc(val: number) {
    if (this.doc && (val != this._pc || !this.running)) {
      let pre = Math.floor(this._pc / 4);
      let cur = Math.floor(val / 4);

      if (!this.running) {
        this.doc.removeLineClass(this.previousLine, 'wrap', 'runned');
        this.doc.removeLineClass(pre, 'wrap', 'next');
      } else {
        this.doc.removeLineClass(this.previousLine, 'wrap', 'runned');
        this.doc.removeLineClass(pre, 'wrap', 'next');
        this.doc.addLineClass(this.runnedLine, 'wrap', 'runned');
        if (cur < this.doc.lineCount()) {
          this.doc.addLineClass(cur, 'wrap', 'next');
        }
        this.previousLine = this.runnedLine;
      }
    }
    this._pc = val;
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

  ngOnInit() {
    this.content = window.localStorage.getItem('code') || 'main: ';
  }

  ngAfterViewInit() {
    this.doc.on("change", (event) => {
      this.onStop();
    });
  }

  onRun() {
    if (!this.running) {
      this.currentLine = this.content.split('\n').findIndex((line) => RegExp('^'+this.start+':').test(line));
      this.doParseTags.emit(this.content);
      this.running = true;
    }
    this.runnedLine = this.currentLine;
    this.currentLine++;
    this.runLine.emit(this.doc.getLine(this.runnedLine));
  }

  onStop() {
    this.running = false;
    this.currentLine = 0;
  }

  onSave() {
    window.localStorage.setItem('code', this.content);
  }

}

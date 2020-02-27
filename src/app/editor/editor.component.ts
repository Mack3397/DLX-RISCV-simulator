import 'codemirror/addon/selection/active-line'
import './modes/dlx.js';
import './modes/rv32i.js';
import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { EditorFromTextArea } from 'codemirror';
import { CodeService } from '../services/code.service.js';
import { MemoryService } from '../services/memory.service.js';
import { Registers } from '../registers/registers.js';
import { trigger, transition, style, animate, query, group } from "@angular/animations";
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StartLogicalNetwork } from '../memory/model/start.logical-network.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass'],
  animations: [
    trigger('showHideTrigger', [
      transition(':enter', [
        group([
          style({ height: '0'}),
          animate('200ms ease-out', style({ height: '*' })),
          query('mat-card', [
            style({ transform: 'translateY(-100%)' }),
            animate('200ms ease-out', style({ transform: 'translateY(0)' })),
          ])
        ])
      ]),
      transition(':leave', [
        group([
          animate('200ms ease-out', style({ height: '0' })),
          query('mat-card', [
            animate('200ms ease-out', style({ transform: 'translateY(-100%)' }))
          ])
        ])
      ])
    ])
  ],
})
export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;
  @ViewChild('form', { static: false }) form: NgForm;
  
  @Input() public codeService: CodeService;
  @Input() registers: Registers;

  private _pc: number;
  @Output() pcChange: EventEmitter<number> = new EventEmitter();

  private timeout;
  private previousLine: number = 0;
  private runnedLine: number = 0;
  private running: boolean = false;
  private continuousRunning = false;
  errorMessage: string;
  start: string = 'main';
  interval: number = 1000;

  get options() {
    return {
      lineNumbers: true,
      firstLineNumber: 0,
      lineNumberFormatter: (line: number) => (line * 4).toString(16).toUpperCase(),
      theme: 'dlx-riscv-theme',
      mode: this.codeService.editorMode,
      styleActiveLine: true,
      viewportMargin: Infinity
    };
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

  get isContinuousRunDisabled(): boolean {
    if(this.doc)
      return (this.currentLine >= this.doc.lineCount());
    else
      return false;
  }

  get isRunDisabled(): boolean {
    if(this.doc)
      return (this.currentLine >= this.doc.lineCount()) || this.continuousRunning;
    else
      return false;
  }

  get isStopDisabled(): boolean {
    return !this.running;
  }

  constructor(private memoryService: MemoryService, route: ActivatedRoute) {
    try {
      let editor_settings = JSON.parse(window.localStorage.getItem('editor_settings'));
      if (editor_settings && editor_settings.start && editor_settings.interval) {
        this.start = editor_settings.start;
        this.interval = editor_settings.interval;
      }
    } catch (error) {
      window.localStorage.removeItem('editor_settings');
    }
  }

  ngAfterViewInit() {
    this.doc.on("change", (event) => {
      if (this.running) this.onStop();
      if (this.errorMessage) { this.doc.removeLineClass(this.runnedLine, 'wrap', 'error'); this.errorMessage = undefined;}
    });
  }

  continuousRun() {
    this.continuousRunning = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.onRun();
    this.timeout = setInterval(() => {
      if(this._pc >= this.codeService.content.split('\n').length * 4) {
        clearTimeout(this.timeout);
      }
      this.onRun();
    }, this.interval);
  }

  onPause() {
    if (this.timeout) clearTimeout(this.timeout);
    this.continuousRunning = false;
  }

  onRun() {
    if (!this.running) {
      this.doc.removeLineClass(this.runnedLine, 'wrap', 'error');
      this.errorMessage = undefined;
      this.codeService.interpreter.parseTags(this.codeService.content, this.start);
      if (this.codeService.editorMode === 'dlx') {
        (this.memoryService.memory.devices.find(v => v.name == 'Start') as StartLogicalNetwork).a_set();
      } else {
        this._pc = this.codeService.interpreter.getTag('start_tag');
      }
      this.running = true;
    }
    this.runnedLine = this.currentLine;
    this.currentLine++;
    try {
      this.codeService.interpreter.run(this.doc.getLine(this.runnedLine), this.registers, this.memoryService.memory);
    } catch (error) {
      this.onStop();
      this.doc.addLineClass(this.runnedLine, 'wrap', 'error');
      this.errorMessage = error.message;
      console.error(error);
    }
  }

  onStop() {
    this.running = false;
    this.currentLine = 0;
    clearTimeout(this.timeout);
    this.continuousRunning = false;
  }

  onSave() {
    this.codeService.save();
    window.localStorage.setItem('editor_settings', `{"start": "${this.start}", "interval": ${this.interval}}`);
    this.form.form.markAsPristine();
  }

  onInterrupt() {
    this.codeService.interpreter.interrupt(this.registers);
  }

}

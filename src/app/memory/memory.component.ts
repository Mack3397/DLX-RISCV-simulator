import { Component, OnInit, Input } from '@angular/core';
import { Memory } from './model/memory';
import { Device } from './model/device';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.sass'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
})
export class MemoryComponent implements OnInit {

  @Input() memory: Memory;
  selected: Device;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Device } from './model/device';
import { trigger, style, transition, animate } from '@angular/animations';
import { MemoryService } from '../services/memory.service';

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
  selected: Device;

  constructor(public memoryService: MemoryService) { }

  ngOnInit() {
  }

  onAdd() {
    let firstFreeAddr = this.memoryService.memory.firstFreeAddr;
    this.memoryService.add('New', firstFreeAddr, firstFreeAddr + 0x01FFFFFF)
  }

  onDelete(dev: Device) {
    this.memoryService.remove(dev);
    this.selected = null;
  }

}

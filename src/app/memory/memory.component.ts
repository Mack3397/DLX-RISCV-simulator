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
    this.memoryService.save();
  }

  onDelete(dev: Device) {
    this.memoryService.remove(dev);
    this.selected = null;
    this.memoryService.save();
  }

  onChange(event:any, side: string) {
    let indexSelectedDevice = this.memoryService.memory.devices.indexOf(this.selected);
    side == "min" ? this.selected.min_address = this.memoryService.memory.devices[indexSelectedDevice - 1].max_address + 1 : (side == "max" ? this.selected.max_address = this.memoryService.memory.devices[indexSelectedDevice + 1].min_address - 1 : (window.alert(event.target.value + ' name changed.')));
    parseInt(this.selected.size) >= 128 ? this.memoryService.save() : window.alert("Memory is less than 128MB");
  }

}

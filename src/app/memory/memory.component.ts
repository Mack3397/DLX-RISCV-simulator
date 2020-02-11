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

  get canMoveSelectedLeft(): boolean {
    let devices = this.memoryService.memory.devices;
    let index = devices.indexOf(this.selected);
    return (this.selected.name !== 'EPROM') && 
      (index > 0);
  }
  get canMoveSelectedRight(): boolean {
    let devices = this.memoryService.memory.devices;
    let index = devices.indexOf(this.selected);
    return (this.selected.name !== 'EPROM') && 
      (index < devices.length - 1);
  }


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

  onChange(event:any) {
    // ((this.memoryService.memory.devices.find((dev) => dev.checkAddress(this.selected.max_address)) != this.selected) || (this.memoryService.memory.devices.find((dev) => dev.checkAddress(this.selected.min_address)) != this.selected)) ? window.alert("Error") : (parseInt(this.selected.size) >= 128 ? this.memoryService.save() : window.alert("Error"));
    this.memoryService.memory.devices.some((dev) => ((this.selected.checkAddress(dev.min_address) || this.selected.checkAddress(dev.max_address)) && dev.name != this.selected.name)) ? window.alert("Error") : (parseInt(this.selected.size) >= 128 ? this.memoryService.save() : window.alert("Memory is less than 128 MB"));
  }

  moveSelectedLeft() {

  }

  moveSelectedRight() {

  }
}

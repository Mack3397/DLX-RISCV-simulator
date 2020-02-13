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
    return (this.selected.name !== 'EPROM' && this.selected.name != 'RAM B') && 
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
    let firstAdd = this.memoryService.memory.firstFreeAddr() + 1;
    this.memoryService.add('New', firstAdd, firstAdd + 0x01FFFFFF)
    this.memoryService.save();
  }

  onDelete(dev: Device) {
    this.memoryService.remove(dev);
    this.selected = null;
    this.memoryService.save();
  }

  onChange(event:any, side: string) {
    let devices = this.memoryService.memory.devices;
    let indexSelectedDevice = this.memoryService.memory.devices.indexOf(this.selected);
    if (side == 'min') {
      if (this.selected.min_address <= devices[indexSelectedDevice - 1].max_address) {
        this.selected.min_address = devices[indexSelectedDevice - 1].max_address + 1;
      }
    } else if (side == 'max') {
      if (this.selected.max_address >= devices[indexSelectedDevice + 1].min_address) {
        this.selected.max_address = devices[indexSelectedDevice + 1].min_address - 1;
      }
    }
    parseInt(this.selected.size) >= 128 ? this.memoryService.save() : window.alert("Memory is less than 128MB");		     
  }

  moveSelectedLeft() {
    let endAddress = 0;
    let indexSelectedDevice = this.memoryService.memory.devices.indexOf(this.selected);
    let sizeOfSelected = this.selected.max_address - this.selected.min_address;
    let spaceBeforeFirstDevice = this.memoryService.memory.devices[indexSelectedDevice].min_address - this.memoryService.memory.devices[indexSelectedDevice - 1].max_address;
    if(spaceBeforeFirstDevice >= 33554432) {
      this.selected.max_address -= 33554432;
      this.selected.min_address -= 33554432;
    } else if ((endAddress = this.spaceBetweenDevices(indexSelectedDevice, sizeOfSelected, 'left')) != 0) {
      this.selected.max_address = endAddress - 1;
      this.selected.min_address = this.selected.max_address - sizeOfSelected;
    }
    this.memoryService.memory.devices = this.memoryService.memory.devices.sort((a,b) => a.min_address - b.min_address);
    this.memoryService.save();
  }

  moveSelectedRight() {
    let startAddress = 0;
    let indexSelectedDevice = this.memoryService.memory.devices.indexOf(this.selected);
    let sizeOfSelected = this.selected.max_address - this.selected.min_address;
    let lastDevice = this.memoryService.memory.devices[this.memoryService.memory.devices.length - 1];
    let spaceBeforeFirstDevice = this.memoryService.memory.devices[indexSelectedDevice + 1].min_address - this.memoryService.memory.devices[indexSelectedDevice].max_address;
    if(spaceBeforeFirstDevice >= 33554432) {                                                            // Muovi avanti 128Mb se c'è abbastanza spazio
      this.selected.max_address += 33554432;
      this.selected.min_address += 33554432;
    } else if ((startAddress = this.spaceBetweenDevices(indexSelectedDevice, sizeOfSelected, 'right')) != 0) {   // Muovi tra due device avanti a me
      console.log(startAddress);
      this.selected.min_address = startAddress + 1;
      this.selected.max_address = this.selected.min_address + sizeOfSelected;
    }
    this.memoryService.memory.devices = this.memoryService.memory.devices.sort((a,b) => a.min_address - b.min_address);
    this.memoryService.save();
  }

  private spaceBetweenDevices(indexSelectedDevice: number, sizeOfSelected: number, side: string): number {
    for(let i = indexSelectedDevice; i < this.memoryService.memory.devices.length - 2 && side == 'right'; i++) {
      if((this.memoryService.memory.devices[i + 2].min_address - this.memoryService.memory.devices[i + 1].max_address) >= sizeOfSelected) {
        return this.memoryService.memory.devices[i + 1].max_address;
      }
    }
    for(let i = indexSelectedDevice; i > 1 && side == 'left'; i--) {
      if((this.memoryService.memory.devices[i - 1].min_address - this.memoryService.memory.devices[i - 2].max_address) >= sizeOfSelected) {
        return this.memoryService.memory.devices[i - 1].min_address;
      }
    }
    return 0;
  }
}

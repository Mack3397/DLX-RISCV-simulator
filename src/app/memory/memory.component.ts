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

  onChange(event:any, side: string) {
    let indexSelectedDevice = this.memoryService.memory.devices.indexOf(this.selected);
    side == "min" ? this.selected.min_address = this.memoryService.memory.devices[indexSelectedDevice - 1].max_address + 1 : (side == "max" ? this.selected.max_address = this.memoryService.memory.devices[indexSelectedDevice + 1].min_address - 1 : (window.alert(event.target.value + ' name changed.')));
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
    } 
    //   else if ((endAddress = this.spaceBetweenDevices(indexSelectedDevice, sizeOfSelected, 'right')) != 0) {
    //   console.log(endAddress);
    //   this.selected.max_address = endAddress - 1;
    //   this.selected.min_address = this.selected.max_address - sizeOfSelected;
    // }
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
      this.selected.min_address = startAddress + 1;
      this.selected.max_address = this.selected.min_address + sizeOfSelected;
    } else if (4294967295 - lastDevice.max_address >= sizeOfSelected) {                                 // Passa oltre l'ultimo device
      this.selected.min_address = lastDevice.max_address + 1;
      this.selected.max_address = this.selected.min_address + sizeOfSelected;
    }
    this.memoryService.memory.devices = this.memoryService.memory.devices.sort((a,b) => a.min_address - b.min_address);
    this.memoryService.save();
  }

  private spaceBetweenDevices(indexSelectedDevice: number, sizeOfSelected: number, side: string): number {
    for(let i = indexSelectedDevice; i < this.memoryService.memory.devices.length - 2 && side == 'right'; i++) {
      if((this.memoryService.memory.devices[i + 1].min_address - this.memoryService.memory.devices[i].max_address) >= sizeOfSelected) {
        return this.memoryService.memory.devices[i].max_address;
      }
    }

    for(let i = indexSelectedDevice; i > 1 && side == 'left'; i--) {
      if((this.memoryService.memory.devices[i].min_address - this.memoryService.memory.devices[i - 1].max_address) >= sizeOfSelected) {
        return this.memoryService.memory.devices[i].min_address;
      }
    }
    return 0;
  }
}

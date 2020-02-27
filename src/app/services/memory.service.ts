import { Injectable, Injector } from '@angular/core';
import { Device, IDevice } from '../memory/model/device';
import { Eprom } from '../memory/model/eprom';
import { Memory } from '../memory/model/memory';
import { StartLogicalNetwork } from '../memory/model/start.logical-network';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  memory: Memory;

  constructor(injector: Injector) {
    let tmp = window.localStorage.getItem('memory');

    if (tmp) {
      this.memory = new Memory(tmp, injector);
    } else {
      this.memory = new Memory();
      this.memory.add(Eprom, 0x00000000, 0x07FFFFFF, injector);
      this.memory.add('RAM A', 0x10000000, 0x1FFFFFFF);
      this.memory.add(StartLogicalNetwork, 0x30000000, 0x30000001, injector);
      this.memory.add('RAM B', 0x38000000, 0x3FFFFFFF);
    }
  }

  public add(name: string|IDevice, min_address: number, max_address: number, injector?: Injector): void {
    this.memory.add(name, min_address, max_address, injector);
  }

  public remove(dev: Device): void {
    this.memory.remove(dev)
  }

  save() {
    window.localStorage.setItem('memory', JSON.stringify(this.memory.devices.map(dev => { 
      return {proto: dev.constructor.name, name: dev.name, min_address: dev.min_address, max_address: dev.max_address} 
    })));
  }
}

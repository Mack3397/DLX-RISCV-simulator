import { Device, IDevice } from './device';
import { Injector } from '@angular/core';

export class Memory {
    devices: Device[] = [];

    public add(name: string|IDevice, min_address: number, max_address: number, injector?: Injector): void {
        if (this.devices.every(dev => !(dev.checkAddress(min_address) || dev.checkAddress(max_address)))) {
            if (typeof name == 'string') {
                this.devices.push(new Device(name, min_address, max_address));
            } else {
                this.devices.push(new name(min_address, max_address, injector))
            }
        }
    }

    public get(name: string): Device {
        return this.devices.find(dev => dev.name === name);
    }

    public load(address: number): number {
        let device = this.devices.find(dev => dev.checkAddress(address));
        if (device) {
            return device.load(address);
        }
        return 0;
    }
    
    public store(address: number, word: number): number {
        let device = this.devices.find(dev => dev.checkAddress(address));
        if (device) {
            device.store(address, word);
        }
        return word;
    }
}

import { Device, IDevice } from './device';
import { Injector } from '@angular/core';
import { Eprom } from './eprom';

export class Memory {
    devices: Device[] = [];

    public get firstFreeAddr(): number {
        let firstFreeAddr = 0;
        this.devices.forEach(dev => {
            if (dev.checkAddress(firstFreeAddr)) {
                firstFreeAddr = dev.max_address + 1;
            }
        });
        return firstFreeAddr;
    }

    constructor(struct?: string, injector?: Injector) {
        if (struct) {
            JSON.parse(struct).forEach(el => {
                switch (el.proto) {
                    case Eprom.name: this.add(Eprom, el.min_address, el.max_address, injector);
                        break;
                    default: this.add(el.name, el.min_address, el.max_address);
                        break;
                }
            });
        }
    }

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

    public remove(dev: Device): void {
        this.devices = this.devices.filter(device => device != dev);
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

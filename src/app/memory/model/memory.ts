import { Injector } from '@angular/core';
import { Device, IDevice } from './device';
import { Eprom } from './eprom';
import { StartLogicalNetwork } from './start.logical-network';

export class Memory {
    devices: Device[] = [];

    public firstFreeAddr(): number {
        for(let i = 0; i < this.devices.length - 1; i++) {
            if((this.devices[i+1].min_address - this.devices[i].max_address) >= 33554432) {
                return this.devices[i].max_address;
            }
        }
        return 0;
    }

    constructor(struct?: string, injector?: Injector) {
        if (struct) {
            JSON.parse(struct).forEach(el => {
                switch (el.proto) {
                    case Eprom.name: this.add(Eprom, el.min_address, el.max_address, injector);
                        break;
                    case StartLogicalNetwork.name: this.add(StartLogicalNetwork, el.min_address, el.max_address, injector);
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
                this.devices.push(new name(min_address, max_address, injector));
            }
            this.devices = this.devices.sort((a,b) => a.min_address - b.min_address);
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
            console.log('Device trovato LOAD ' + address + ' Dev ' + device.name);
            return device.load(address);
        } else throw new Error("Device not found");
    }
    
    public store(address: number, word: number): number {
        let device = this.devices.find(dev => dev.checkAddress(address));
        if (device) {
            console.log('Device trovato STORE ' + address + ' number: ' + word + ' Dev ' + device.name);
            device.store(address, word);
        } else throw new Error("Device not found");
        return word;
    }
}

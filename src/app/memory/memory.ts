import { Device } from './device';

export class Memory {
    devices: Device[] = [];

    public add(name: string, min_address: number, max_address: number): void {
        if (this.devices.every(dev => !(dev.checkAddress(min_address) || dev.checkAddress(max_address)))) {
            this.devices.push(new Device(name, min_address, max_address));
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

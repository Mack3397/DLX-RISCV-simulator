import { Device } from './device';

export class Memory {
    devices: Device[] = [];

    public add(name: string, address: number, size: number): void {
        if (this.devices.every(dev => !dev.checkAddress(address))) {
            this.devices.push(new Device(name, address, size));
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
    
    public store(address: number, word: number): void {
        let device = this.devices.find(dev => dev.checkAddress(address));
        if (device) {
            device.store(address, word);
        }
    }
}

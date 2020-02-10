import { Injector } from '@angular/core';

export interface IDevice {
    new (min_address: number, max_address: number, injector: Injector): Device;
}
export class Device {
    name: string
    private memory: number[];
    min_address: number;
    max_address: number;

    public get min_address_hex() : string {
        return ((this.min_address << 2) >>> 0).toString(16).toUpperCase().padStart(8, '0');
    }
    
    public set min_address_hex(v : string) {
        if (v.length == 8) {
            let iv = parseInt(v, 16)
            if (iv || iv === 0) {
                this.min_address = iv >>> 2;
            }
        }
    }
    
    public get max_address_hex() : string {
        return ((this.max_address << 2) >>> 0).toString(16).toUpperCase().padStart(8, '0');
    }

    public set max_address_hex(v : string) {
        if (v.length == 8) {
            let iv = parseInt(v, 16)
            if (iv || iv === 0) {
                this.max_address = iv >>> 2;
            }
        }
    }

    public get size(): string {
        //1 address = 4 byte so
        //262144 = 1024 * 1024 / 4
        return ((this.max_address - this.min_address + 1) / 262144)+'MB'
    }

    constructor(name: string, min_address: number, max_address: number) {
        this.name = name;
        this.memory = [];
        this.min_address = min_address;
        this.max_address = max_address;
    }

    public checkAddress(address: number): boolean {
        return this.min_address <= address && address <= this.max_address;
    }

    public load(address: number): number {
        return this.memory[address];
    }
    
    public store(address: number, word: number): void {
        this.memory[address] = word;
    }
}

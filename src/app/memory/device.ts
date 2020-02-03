export class Device {
    name: string
    private memory: number[];
    address: number;
    size: number;

    constructor(name: string, address: number, size: number) {
        this.name = name;
        this.memory = [];
        this.address = address;
        this.size = size;
    }

    public checkAddress(address: number): boolean {
        return this.address <= address && address >= this.address + this.size;
    }

    public load(address: number): number {
        return this.memory[address];
    }
    
    public store(address: number, word: number): void {
        this.memory[address] = word;
    }
}

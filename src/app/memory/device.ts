export class Device {
    name: string
    private memory: number[];
    min_address: number;
    max_address: number;

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

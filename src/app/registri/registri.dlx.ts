import { Registri } from "./registri";

export class RegistriDLX extends Registri{
    
    r : [0,     number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number,
        number, number, number, number, number, number, number, number];

    iar : number;
    mar : number;
    ir : number;
    temp : number;
    mdr : number;
    a : number;
    b : number;

    constructor() {
        super();
        this.r = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.iar = 0;
        this.mar = 0;
        this.ir = 0;
        this.temp = 0;
        this.mdr = 0;
        this.a = 0;
        this.b = 0;
    }
}

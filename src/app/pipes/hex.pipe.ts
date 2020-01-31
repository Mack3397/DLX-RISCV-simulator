import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hex'
})
export class HexPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return (value >>> 0).toString(16).padStart(8,'0').toUpperCase();
  }

}

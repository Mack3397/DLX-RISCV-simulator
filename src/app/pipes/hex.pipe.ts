import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hex'
})
export class HexPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    return value.toString(16).padStart(8,'0').toUpperCase();
  }

}

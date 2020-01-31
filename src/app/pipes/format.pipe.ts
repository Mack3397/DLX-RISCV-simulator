import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(n: number, type: 'dec'|'bin'|'hex'): any {
    switch (type) {
      case 'dec':
        return n
      case 'bin':
        return (n >>> 0).toString(2).padStart(32,'0');
      case 'hex':
        return '0x'+(n >>> 0).toString(16).padStart(8,'0').toUpperCase();
    }
    return null;
  }

}

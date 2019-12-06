import { Directive, Input, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Directive({
  selector: '[appCodeline]'
})
export class CodelineDirective implements OnChanges{
  
  @Input() appCodeline: string

  constructor(private el: ElementRef) { }

  instructions_R = ['ADD','AND'];
  instructions_I = ['ADDI','ANDI'];
  instructions_J = ['J','JAL'];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.appCodeline){
      this.el.nativeElement.innerHTML = '';
      
      let el: HTMLSpanElement;
      let i = 0;
      let uToken: string;
      let elClass: string;

      let tokens = this.appCodeline.split(/(?=\W)|(?<=\W)/g);
      console.log(tokens);
      tokens.forEach((token) => {
        
        uToken = token.toUpperCase();

        if (this.instructions_R.includes(uToken)) {
          elClass = 'instruction-r';
        } else if (this.instructions_I.includes(uToken)) {
          elClass = 'instruction-i';
        } else if (this.instructions_J.includes(uToken)) {
          elClass = 'instruction-j';
        } else if (/^R\d{1,2}$/.test(uToken)) {
          elClass = 'registry' + (i++ ? '' : '-d');
        } else if (/^0X[0-9A-F]+$/.test(uToken)) {
          elClass = 'immediate';
        } else {
          elClass = null;
        }

        if (elClass) {
          if (el) {
            this.el.nativeElement.append(el);
          }
          el = document.createElement('span');
          el.innerText = token;
          el.classList.add(elClass);
          this.el.nativeElement.append(el);
          el = null;
        } else {
          if (!el) {
            el = document.createElement('span');
          }
          el.innerText += token;
        }
        
      });
      if (el) {
        this.el.nativeElement.append(el);
      }
    }
  }

}

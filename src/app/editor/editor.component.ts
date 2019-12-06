import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit {

  lines : string[] = ['ADDI R2, R3, 0x00F8'];
  cursor = {x: 0, y: 0};

  constructor() { }

  ngOnInit() {
  }

  onFocus(event: MouseEvent) {
    console.log(event);
  }

  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const currline = this.lines[this.cursor.y];
    switch (event.key) {
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'Enter':
        this.lines[this.cursor.y] = currline.slice(0, this.cursor.x);
        this.lines.splice(this.cursor.y + 1, 0, currline.slice(this.cursor.x));
        this.cursor.y++;
        this.cursor.x = 0;
        break;
      case 'Backspace':
        if (this.cursor.x > 0) {
          this.lines[this.cursor.y] = currline.slice(0, this.cursor.x - 1) + currline.slice(this.cursor.x);
          this.moveLeft();
        } else if (this.cursor.y > 0) {
          this.moveLeft();
          this.lines[this.cursor.y] += this.lines[this.cursor.y + 1];
          this.lines.splice(this.cursor.y + 1, 1);
        }
        break;
      case 'Delete':
        if (this.cursor.x < currline.length) {
          this.lines[this.cursor.y] = currline.slice(0, this.cursor.x) + currline.slice(this.cursor.x + 1);
        } else if (this.cursor.y < this.lines.length - 1) {
          this.lines[this.cursor.y] += this.lines[this.cursor.y + 1];
          this.lines.splice(this.cursor.y + 1, 1);
        }
        break;
      case 'Tab':
        const spaces = 4 - this.cursor.x % 4;
        this.lines[this.cursor.y] = currline.slice(0, this.cursor.x) + ' '.repeat(spaces) + currline.slice(this.cursor.x);
        this.cursor.x += spaces;
        break;
      default :
        if (event.key.length == 1) {
          this.lines[this.cursor.y] = currline.slice(0, this.cursor.x) + event.key + currline.slice(this.cursor.x);
          this.cursor.x++;
        }
        break;
    }
  
    console.log(`${this.cursor.x}, ${this.cursor.y} | ${event.key}`);
  }

  moveDown() {
    if (this.cursor.y < this.lines.length - 1) {
      this.cursor.y++
      const max = this.lines[this.cursor.y].length;
      if (this.cursor.x > max) {
        this.cursor.x = max;
      }
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      const max = this.lines[this.cursor.y].length;
      if (this.cursor.x > max) {
        this.cursor.x = max;
      }
    }
  }

  moveRight() {
    if (this.cursor.x < this.lines[this.cursor.y].length) {
      this.cursor.x++;
    } else {
      this.moveDown();
    }
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
    } else if(this.cursor.y > 0) {
      this.moveUp();
      this.cursor.x = this.lines[this.cursor.y].length;
    }
  }

}

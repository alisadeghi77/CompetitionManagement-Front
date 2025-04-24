import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <i
       [class]=" 'bi bi-' + name + ' ' + extraClass"
       [ngStyle]="{ 'font-size': size + 'px', 'color': color }">
    </i>
  `,
  styles: []
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: number = 16;
  @Input() color: string = '';
  @Input() extraClass: string = '';
}

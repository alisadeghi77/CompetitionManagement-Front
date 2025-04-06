import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [NgbAccordionModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'competition';
}

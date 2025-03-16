import { Component } from '@angular/core';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ERA_INFO';
}

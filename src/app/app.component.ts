import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { HelloWorldComponent } from './hello-world/hello-world.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HelloWorldComponent], // Add RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';
}

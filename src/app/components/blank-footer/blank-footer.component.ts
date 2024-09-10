import { Component } from '@angular/core';
import { AuthFooterComponent } from "../auth-footer/auth-footer.component";

@Component({
  selector: 'app-blank-footer',
  standalone: true,
  imports: [AuthFooterComponent],
  templateUrl: './blank-footer.component.html',
  styleUrl: './blank-footer.component.scss'
})
export class BlankFooterComponent {

}

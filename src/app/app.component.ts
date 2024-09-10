import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBlankComponent } from "./components/nav-blank/nav-blank.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlowbiteService } from './core/services/flowbite.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBlankComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit{
  private readonly _FlowbiteService = inject(FlowbiteService);

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {});
  }




}

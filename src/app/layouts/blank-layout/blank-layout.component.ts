import { Component, inject, OnInit } from '@angular/core';
import { NavBlankComponent } from "../../components/nav-blank/nav-blank.component";
import { BlankFooterComponent } from "../../components/blank-footer/blank-footer.component";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [NavBlankComponent, BlankFooterComponent, RouterOutlet],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent implements OnInit {
  private readonly _AuthService = inject(AuthService);

  private wishListSub!: Subscription;

  ngOnInit(): void {
    this._AuthService.setUserToken();
    this._AuthService.pathUserData();
  }
}

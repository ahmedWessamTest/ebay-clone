import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { IOrder } from '../../core/interfaces/iorder';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit, OnDestroy {
  private readonly _OrdersService = inject(OrdersService);
  private readonly _AuthService = inject(AuthService);

  allordersSub!: Subscription;
  allordersObject: WritableSignal<IOrder | null> = signal(null);

  ngOnInit(): void {

    this.allordersSub = this._OrdersService.getAllOrders(this._AuthService.globalUserToken().id).subscribe({
      next: (res) => {
        this.allordersObject.set(res.at(-1));
      }
    })
  }
  ngOnDestroy(): void {
    this.allordersSub?.unsubscribe();
  }

}

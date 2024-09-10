import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { ICart } from '../../core/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  cartProductsSub!: Subscription;
  removeCartItemSub!: Subscription;
  cartQuantitySub!: Subscription;
  clearAllSub!: Subscription;
  cartObject: ICart = {} as ICart;
  numberOfProducts!: number;

  ngOnInit(): void {
    this.cartProductsSub = this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this.cartObject = res.data;
        this.numberOfProducts = res.numOfCartItems;
      }
    })
  }

  removeCartItem(id: string): void {
    this.removeCartItemSub = this._CartService.removeCartItem(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.cartObject = res.data;
          this._CartService.cartNumber.set(res.numOfCartItems);
        }
      }
    })
  }
  cartQuantity(id: string, count: number): void {
    this.cartQuantitySub = this._CartService.updateCartProduct(id, count).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.cartObject = res.data;
          this._ToastrService.success('ebay', 'product quantity changed')
        }
      }
    })
  }
  clearAllCart(): void {
    this.clearAllSub = this._CartService.clearCartItems().subscribe({
      next: (res) => {
        if (res.message === "success") {
          this._ToastrService.success('ebay', 'all products cleared')
          this.cartObject = {} as ICart;
          this._CartService.cartNumber.set(0);
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.cartProductsSub?.unsubscribe();
    this.cartQuantitySub?.unsubscribe();
    this.removeCartItemSub?.unsubscribe();
    this.clearAllSub?.unsubscribe()
  }
}

import { CurrencyPipe, NgClass } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, input, InputSignal, NgZone, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CutTextPipe, NgClass],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnDestroy, OnInit {
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgZone = inject(NgZone);

  productObject: InputSignal<IProduct> = input.required();
  wishListObject: Signal<IProduct[]> = computed(() => this._WishlistService.wishListUpdate());

  productInWishList: WritableSignal<boolean> = signal(false);

  private wishListSub!: Subscription;
  private wishListGetSub!: Subscription;
  ngOnInit(): void {
    this._NgZone.runOutsideAngular(() => {
      this.wishlistCheck();
      this.wishListGetSub = this._WishlistService.getUserWishList().subscribe({
        next: (res) => {
          this._WishlistService.wishListUpdate.set(res.data);
        }
      })
    })
  }

  wishlistCheck(): void {
    for (let i = 0; i < this.wishListObject().length; i++) {
      if (this.wishListObject()[i].id === this.productObject().id) {
        this.productInWishList.set(true);
        return
      }
    }
    this.productInWishList.set(false);

  }
  wishListUpdate(newId: string[]): void {
    for (let i = 0; i < newId.length; i++) {
      if (newId[i] === this.productObject().id) {
        this.productInWishList.set(true);
        return
      }
    }
    this.productInWishList.set(false);
  }

  addProductToWishlist(productId: string): void {
    if (!this.productInWishList()) {
      this._NgZone.runOutsideAngular(() => {
        this.wishListSub = this._WishlistService.setWishList(productId).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this._ToastrService.success(res?.message, 'eBay');
              this.wishListUpdate(res.data)

            }
          }
        })
      })
    } else {
      this.removeProduct();
    }
  }
  removeProduct(): void {
    this._NgZone.runOutsideAngular(() => {
      this._WishlistService.removeWishlist(this.productObject().id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this._ToastrService.success(res?.message, 'eBay');
            this.wishListUpdate(res.data);
            console.log(res);

          }
        }
      })
    })
  }
  ngOnDestroy(): void {
    this.wishListSub?.unsubscribe();
    this.wishListGetSub?.unsubscribe();
  }

}

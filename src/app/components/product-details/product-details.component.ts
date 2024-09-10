import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProductDetails } from '../../core/interfaces/iproduct-details';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule, CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _Router = inject(Router);

  private getProductSub!: Subscription;
  private addToCartSub!: Subscription;
  private addToWishlistSub!: Subscription;


  productInfo: WritableSignal<IProductDetails | null> = signal(null);
  ngOnInit(): void {
    let paramId: string | null = ''
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        paramId = p.get('id');
      }
    })
    this.getProductSub = this._ProductsService.getSpecificProduct(paramId).subscribe({
      next: (res) => {
        this.productInfo.set(res.data);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error in specific product API: ", err);
      }
    })
  }

  addToCart(productId: string): void {
    this.addToCartSub = this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === "success") {
          this._CartService.cartNumber.set(res.numOfCartItems);
          this._ToastrService.success(res.message, 'eBay');
          if (res.message) {
            this._Router.navigate(['/cart']);
          }
        }
      }
    })
  }
  addToWishlist(id: string): void {
    this.addToWishlistSub = this._WishlistService.setWishList(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this._ToastrService.success(res.message, 'eBay');
          this._WishlistService.getUserWishList().subscribe({
            next:(res)=>{
              this._WishlistService.wishListUpdate.set(res.data);
            }
          })
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.getProductSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe()
  }
  DetailsOwlOptions: OwlOptions = {
    rtl:true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    lazyLoad: true,
  }
}

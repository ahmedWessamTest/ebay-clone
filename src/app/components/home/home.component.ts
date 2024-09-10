import { AfterViewChecked, Component, computed, inject, OnDestroy, OnInit, Renderer2, Signal, signal, WritableSignal } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../core/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, CarouselModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _TranslateService = inject(TranslateService)



  productsList: WritableSignal<IProduct[] | null> = signal(null);
  categoriesList: WritableSignal<ICategory[] | null> = signal(null);
  wishlistObject: WritableSignal<IProduct[]> = signal([]);

  getProductSub!: Subscription;
  getCategoriesSub!: Subscription;
  getWishlistSub!: Subscription;

  homeOwlOptions: OwlOptions = {
    rtl:true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    nav: false
  }
  CategoriesOptions: OwlOptions = {
    rtl: true,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      1200: {
        items: 7
      }
    },
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    nav: false
  }






  ngOnInit(): void {
    this._TranslateService.onLangChange.subscribe((event)=>{
      this.updateOwlOptionsRtl(event.lang);
    })

    this.getCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.error("Error in getAllCategories API: ", err);
      }
    })

    this.getProductSub = this._ProductsService.getProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
      },
      error: (err) => {
        console.error("Error in products API: ", err);
      }
    })

    this.getWishlistSub = this._WishlistService.getUserWishList().subscribe({
      next: (res) => {
        this.wishlistObject.set(res.data);
      }
    })
  }
  updateOwlOptionsRtl(lang:string) {
    const rtlLanguage = ['ar','en'];
    this.homeOwlOptions = {
      ...this.homeOwlOptions,
      rtl: rtlLanguage.includes(lang)
    }
  }

  ngOnDestroy(): void {
    this.getProductSub?.unsubscribe();
    this.getCategoriesSub?.unsubscribe();
  }

}

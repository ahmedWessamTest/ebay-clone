import { AfterViewInit, Component, computed, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ICategory } from '../../core/interfaces/icategory';
import { IUserData } from '../../core/interfaces/iuser-data';
import { IUserToken } from '../../core/interfaces/iuser-token';
import { AuthService } from '../../core/services/auth.service';
import { CategoriesService } from '../../core/services/categories.service';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { CurrencyPipe, NgClass, TitleCasePipe } from '@angular/common';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';
import { CartService } from '../../core/services/cart.service';
import { SubcategoriesComponent } from "../../core/ui/subcategories/subcategories.component";
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TitleCasePipe, CutTextPipe, SubcategoriesComponent, SearchPipe, FormsModule, NgClass, CurrencyPipe, CutTextPipe, TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit, OnDestroy , AfterViewInit{
  private readonly _FlowbiteService = inject(FlowbiteService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _TranslationService = inject(TranslationService);
  private readonly _TranslateService = inject(TranslateService);
  private readonly _Router = inject(Router);
  readonly _AuthService = inject(AuthService);
  searcher: WritableSignal<string> = signal('');
  showSearch: WritableSignal<boolean> = signal(false);

  userId: Signal<IUserToken> = computed(() => this._AuthService.globalUserToken());
  userInfo: Signal<IUserData> = computed(() => this._AuthService.globalUserData());
  countNumber: Signal<number> = computed(() => this._CartService.cartNumber());
  wishlistObject: Signal<IProduct[]> = computed(() => this._WishlistService.wishListUpdate());
  categoriesList: WritableSignal<ICategory[] | null> = signal(null);
  productList: WritableSignal<IProduct[]> = signal([]);

  private cartSub!: Subscription;
  private productsSub!: Subscription;
  private wishlistSub!: Subscription;
  private removeWishlistSub!: Subscription;
  private removeWishListGetSub!: Subscription;
  langImage(): string {
    const lang = this._TranslateService.currentLang;
    if (lang === 'en') {
      return "./assets/images/united-kingdom.png"
    }
    else if(lang === 'ar') {
      return "./assets/images/egypt.png"
    } else {
      return ""
    }
  }
  ngAfterViewInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {
    });
  }
  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.error("Error in Categories API: ", err);
      }
    })
    this.cartSub = this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this._CartService.cartNumber.set(res.numOfCartItems);
      }
    })
    this.productsSub = this._ProductsService.getProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      }
    })
    this.wishlistSub = this._WishlistService.getUserWishList().subscribe({
      next: (res) => {
        this._WishlistService.wishListUpdate.set(res.data);
      }
    })

  }

  searchOnFocus(): void {
    this.showSearch.set(true);
    console.log(this.showSearch());
  }
  searchOnBlur(): void {
    setTimeout(() => {
      this.showSearch.set(false);
      console.log(this.showSearch());
    }, 200)
  }
  reloadComponent(id: string): void {
    this._Router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this._Router.navigate(['/details', id])
    })
  }
  removeWishListItem(productId: string): void {
    this.removeWishlistSub = this._WishlistService.removeWishlist(productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this._ToastrService.success(res.message, 'eBay');
          this.removeWishListGetSub = this._WishlistService.getUserWishList().subscribe({
            next: (res) => {
              this._WishlistService.wishListUpdate.set(res.data);
            }
          })
        }
      }
    })
  }
  changeLang(lang: string):void {
    this._TranslationService.changeLang(lang);
  }
  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    this.productsSub?.unsubscribe();
    this.wishlistSub?.unsubscribe();
    this.removeWishlistSub?.unsubscribe();
    this.removeWishListGetSub?.unsubscribe();
  }

}

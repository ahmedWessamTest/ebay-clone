import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IProduct } from '../../core/interfaces/iproduct';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand-view',
  standalone: true,
  imports: [NgxPaginationModule, ProductCardComponent],
  templateUrl: './brand-view.component.html',
  styleUrl: './brand-view.component.scss'
})
export class BrandViewComponent implements OnInit, OnDestroy {

  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  totalItems: WritableSignal<number> = signal(0);
  itemsPerPage: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);

  ProductList: WritableSignal<IProduct[]> = signal([]);

  productSub!: Subscription;

  brandId: WritableSignal<string> = signal('');


  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.brandId.set(param.get('id')!);
      }
    })
    this.productSub = this._ProductsService.getProductsWithBrand(1, this.brandId()).subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.ProductList.set(res.data);
      }
    })

  }
  onPageChange(page: number) {
    this.productSub = this._ProductsService.getProductsWithBrand(page, this.brandId()).subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.ProductList.set(res.data);
      }
    })
  }
  ngOnDestroy(): void {
      this.productSub?.unsubscribe();
  }

}

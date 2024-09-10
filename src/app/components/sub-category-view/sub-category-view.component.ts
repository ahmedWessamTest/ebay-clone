import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-sub-category-view',
  standalone: true,
  imports: [NgxPaginationModule, ProductCardComponent],
  templateUrl: './sub-category-view.component.html',
  styleUrl: './sub-category-view.component.scss'
})
export class SubCategoryViewComponent implements OnInit, OnDestroy{
  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  totalItems:WritableSignal<number> = signal(0);
  itemsPerPage:WritableSignal<number> = signal(0);
  currentPage:WritableSignal<number> = signal(0);
  productObject:WritableSignal<IProduct[]> = signal([]);
  getCatId: WritableSignal<string> = signal('');
  getSubCatId: WritableSignal<string> = signal('');

  productSub!: Subscription;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:(param)=>{
        this.getSubCatId.set(param.get('subCatId')!)
        this.getCatId.set(param.get('catId')!)
      }
    })

    this.productSub = this._ProductsService.getProductsWithSubCategory(this.getCatId(), this.getSubCatId(), 1).subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.productObject.set(res.data);
      }
    })
  }

  onPageChange(page: number) {
    this.productSub = this._ProductsService.getProductsWithSubCategory(this.getCatId(), this.getSubCatId(), page).subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.productObject.set(res.data);
      }
    })
  }
  ngOnDestroy(): void {
      this.productSub?.unsubscribe();
  }
}

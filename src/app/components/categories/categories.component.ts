import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../core/interfaces/iproduct';
import { ProductCardComponent } from "../product-card/product-card.component";
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ProductCardComponent, NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy{
  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  totalItems: WritableSignal<number> = signal(0);
  itemsPerPage: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  productObject: WritableSignal<IProduct[]> = signal([]);
  getCatId: string | null = '';

  private productSub!:Subscription;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.getCatId = param.get('id');
        console.log(this.getCatId);

      }
    })
      this.productSub = this._ProductsService.getProductsWithCategory(this.getCatId!, 1).subscribe({
        next:(res)=>{
          this.productObject.set(res.data);
        }
      })
  }
  onPageChange(page: number) {
    this.productSub = this._ProductsService.getProductsWithCategory(this.getCatId!,page).subscribe({
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

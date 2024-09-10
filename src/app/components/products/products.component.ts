import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { ProductsService } from '../../core/services/products.service';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgxPaginationModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);

  productObject: WritableSignal<IProduct[]> = signal([]);

  totalItems: WritableSignal<number> = signal(0);
  itemsPerPage: WritableSignal<number> = signal(40);
  currentPage: WritableSignal<number> = signal(1);

  productSub!: Subscription;
  ngOnInit(): void {
    this.productSub = this._ProductsService.getProducts().subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.productObject.set(res.data);
      }
    })
  }
  onPageChange(page: number) {
    this.productSub = this._ProductsService.getProductsPagination(page).subscribe({
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

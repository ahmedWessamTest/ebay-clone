import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrandsService } from '../../core/services/brands.service';
import { IBrand } from '../../core/interfaces/ibrand';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [NgxPaginationModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy{
  private readonly _BrandsService = inject(BrandsService);

  totalItems: WritableSignal<number> = signal(0);
  itemsPerPage: WritableSignal<number> = signal(0);
  currentPage: WritableSignal<number> = signal(0);
  brandsList:WritableSignal<IBrand[]> = signal([]);

  brandsSub!: Subscription;

  ngOnInit(): void {
    this.brandsSub = this._BrandsService.getBrands(1).subscribe({
      next:(res)=>{
        this.brandsList.set(res.data);
      }
    })
  }
  onPageChange(page: number) {
    this.brandsSub = this._BrandsService.getBrands(page).subscribe({
      next: (res) => {
        this.totalItems.set(res.results);
        this.itemsPerPage.set(res.metadata.limit);
        this.currentPage.set(res.metadata.currentPage);
        this.brandsList.set(res.data);
      }
    })
  }
  ngOnDestroy(): void {
    this.brandsSub?.unsubscribe()
  }

}

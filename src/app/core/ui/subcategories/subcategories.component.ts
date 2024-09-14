import { Component, inject, input, InputSignal, NgZone, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { ICategory } from '../../interfaces/icategory';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { Subscription } from 'rxjs';
import { ISubCategory } from '../../interfaces/isub-category';
import { Router, RouterLink } from '@angular/router';
import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.scss'
})
export class SubcategoriesComponent implements OnInit, OnDestroy {
  private readonly _SubCategoriesService = inject(SubCategoriesService);
  private readonly _Router = inject(Router);
  private readonly _NgZone = inject(NgZone)


  closeListFn(): void {
    this._SubCategoriesService.closeList.update((val) => !val );
  }

  cat: InputSignal<ICategory> = input.required();

  private subCategoriesSub!: Subscription;
  subCatObject: WritableSignal<ISubCategory[] | null> = signal(null);
  ngOnInit(): void {
    this._NgZone.runOutsideAngular(() => {
      this.subCategoriesSub = this._SubCategoriesService.getSubCategoryOnCategory(this.cat()._id).subscribe({
        next: (res) => {
          this.subCatObject.set(res.data);
        }
      })
    })
  }
  ngOnDestroy(): void {
    this.subCategoriesSub?.unsubscribe();
  }
  reloadCatComponent(id: string): void {
    this._Router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this._Router.navigate(['/categories', id])
    })
  }
  reloadSubCatComponent(catId: string, subCatId: string): void {
    this._Router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
      this._Router.navigate(['/subCat', catId, subCatId]);
    })
  }
}

import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { OrdersService } from '../../core/services/orders.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _OrdersService = inject(OrdersService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);

  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<boolean> = signal(false);

  checkOutSub!: Subscription;

  checkoutForm: FormGroup = this._FormBuilder.group({
    details: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 3 })]],
    phone: [null, [RxwebValidators.required(), RxwebValidators.pattern({ expression: { "phone": /^01[0125]\d{8}$/ } })]],
    city: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 3 })]]
  })


  checkoutSubmit() {
    if (this.checkoutForm.valid && !this.isLoading()) {
      this.isLoading.set(true)
      let cartId: string | null = '';
      this._ActivatedRoute.paramMap.subscribe({
        next: (param) => {
          cartId = param.get('id');
        }
      })
      this.checkOutSub = this._OrdersService.setCheckOut(cartId, this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === "success") {
            this.isLoading.set(false);
            this.errorMsg.set('');
            this.successMsg.set(true);
            setTimeout(() => {
              window.open(res.session.url, '_self');
            }, 2000)
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error.message);
        }
      })
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

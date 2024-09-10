import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IAuthSuccessData } from '../../core/interfaces/auth-Success-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavAuthComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  getRegisterSub!: Subscription;
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal("")
  successMsg: WritableSignal<boolean> = signal(false);


  registerForm: FormGroup = this._FormBuilder.group({
    name: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 3 }), RxwebValidators.maxLength({ value: 20 }), RxwebValidators.alpha()]],
    email: [null, [RxwebValidators.required(), RxwebValidators.email(), RxwebValidators.minLength({ value: 6 })]],
    password: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 8 }), RxwebValidators.pattern({ expression: { 'atLeastOneLetter': /[a-zA-z]/ } }), RxwebValidators.pattern({ expression: { 'atLeastOneNumber': /[\d]+/ } })]],
    rePassword: [null, [RxwebValidators.required(), RxwebValidators.compare({ fieldName: 'password' })]],
    phone: [null, [RxwebValidators.required(), RxwebValidators.pattern({ expression: { 'onlyPhone': /^01[0125]\d{8}$/ } })]]
  });

  registerSubmit() {
    if (this.registerForm.valid && !this.isLoading()) {
      this.isLoading.set(true)
      this.getRegisterSub = this._AuthService.setRegister(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success')
            this.errorMsg.set('');
          this.successMsg.set(true);
          this.isLoading.set(false)
          localStorage.setItem('userToken', res.token);
          this._AuthService.setUserToken();
          this._AuthService.saveUserData(res.user);
          setTimeout(() => {
            this._Router.navigate(['/home']);
          }, 1000)


        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.message);
          console.log(err);
          console.log(this.registerForm.value);


          console.error("error in Register API: ", err);

        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }

  }
  ngOnDestroy(): void {
    this.getRegisterSub?.unsubscribe();
  }
}

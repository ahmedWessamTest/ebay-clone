import { Component, inject, OnDestroy, signal, WritableSignal } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavAuthComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  getLoginSub!: Subscription;
  isLoading: WritableSignal<boolean | never> = signal(false);
  errorMsg: WritableSignal<string> = signal("");
  successMsg: WritableSignal<boolean> = signal(false);

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [RxwebValidators.required(), RxwebValidators.email(), RxwebValidators.minLength({ value: 6 })]],
    password: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 8 }), RxwebValidators.pattern({ expression: { 'atLeastOneLetter': /[a-zA-z]/ } }), RxwebValidators.pattern({ expression: { 'atLeastOneNumber': /[\d]+/ } })]],
  });

  loginSubmit() {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.getLoginSub = this._AuthService.setLogin(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success')
            this.isLoading.set(false);
          this.errorMsg.set('')
          this.successMsg.set(true);
          localStorage.setItem('userToken', res.token);
          this._AuthService.saveUserData(res.user);
          this._AuthService.setUserToken();
          setTimeout(() => {
            this._Router.navigate(['/home']);
          }, 1000)


        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.message);
          console.error("error in Register API: ", err)
        }
      })
    } else {
      this.loginForm.markAllAsTouched()
    }

  }
  ngOnDestroy(): void {
    this.getLoginSub?.unsubscribe();
  }
}

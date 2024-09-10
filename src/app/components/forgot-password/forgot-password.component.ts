import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NavAuthComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router);

  steps: WritableSignal<number> = signal(1);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<boolean> = signal(false);

  setUserEmail: WritableSignal<string> = signal('');

  emailValidation: FormGroup = this._FormBuilder.group({
    email: [null, [RxwebValidators.required(), RxwebValidators.email(), RxwebValidators.minLength({ value: 6 })]],
  });
  codeValidation: FormGroup = this._FormBuilder.group({
    resetCode: [null, [RxwebValidators.required(), RxwebValidators.numeric(), RxwebValidators.pattern({ expression: { "codeLength": /^\d{6}$/ } })]]
  });
  ResetPassForm: FormGroup = this._FormBuilder.group({
    email: [null, [RxwebValidators.required(), RxwebValidators.email(), RxwebValidators.minLength({ value: 6 })]],
    newPassword: [null, [RxwebValidators.required(), RxwebValidators.minLength({ value: 8 }), RxwebValidators.pattern({ expression: { 'atLeastOneLetter': /[a-zA-z]/ } }), RxwebValidators.pattern({ expression: { 'atLeastOneNumber': /[\d]+/ } })]],
  });
  emailSubmit(): void {
    if (this.emailValidation.valid) {
      this.isLoading.set(true);
      this._AuthService.setForgotPassword(this.emailValidation.value).subscribe({
        next: (res) => {
          console.log(res);

          if (res.statusMsg === "success") {
            this.isLoading.set(false);
            this.errorMsg.set("");
            this.successMsg.set(true);
            this.ResetPassForm.patchValue({
              'email': this.emailValidation.get('email')?.value
            })
            // this.setUserEmail.set(this.emailValidation.get('email')?.value);
            setTimeout(() => {
              this.successMsg.set(false);
              this.steps.set(2);
            }, 2000)
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.message);
          console.error("error in verify email API: ", err)
        }
      })
    } else {
      this.emailValidation.markAllAsTouched();
    }
  }
  codeSubmit(): void {
    if (this.emailValidation.valid) {
      this.isLoading.set(true);
      this._AuthService.setVerifyCode(this.codeValidation.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.errorMsg.set("");
          this.successMsg.set(true);
          setTimeout(() => {
            this.successMsg.set(false);
            this.steps.set(3);
          })
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.message);
          console.error("error in reset code API: ", err)
        }
      })
    } else {
      this.codeValidation.markAllAsTouched()
    }
  }
  resetPasswordSubmit(): void {
    if (this.emailValidation.valid) {
      this.isLoading.set(true);
      this._AuthService.setResetPassword(this.ResetPassForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.errorMsg.set("");
          this.successMsg.set(true);
          console.log(res);
          setTimeout(() => {
            this.successMsg.set(false);
            this._Router.navigate(['/login']);
          }, 2000)
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.error?.message);
          console.error("error in reset password API: ", err);
        }
      })
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private dailtTaskApi: DataService, private http: HttpClient, private fb: FormBuilder, private router: Router) { }
  signinform: FormGroup;
  resetPassword: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  errorDiv = false;
  errmsg = '';
  successrstdiv = false;
  successrstmsg = '';
  failrstdiv = false;
  failrstmsg = '';
  ngOnInit() {
    if (localStorage.getItem('username')) {
      this.router.navigateByUrl('/tasklist');
    }
    this.signinform = this.fb.group({
      email : ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password : ['', [Validators.required, Validators.minLength(6)]]
    });
    this.resetPassword = this.fb.group({
      resetEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
    });
  }
  onSubmit = () => {
    if (this.signinform.valid) {
      console.log(this.signinform.controls.email.value)
      const data = {userId: this.signinform.controls.email.value, password: this.signinform.controls.password.value};
      this.dailtTaskApi.signIn(data).then((res) => {
        console.log(res);
        const response = (res as any);
        if (response.status === 1) {
          localStorage.setItem('username', response.username);
          localStorage.setItem('userID', response.userID);
          this.router.navigateByUrl('/tasklist');
        } else {
          this.errorDiv = true;
          this.errmsg = response.message;
          setTimeout(() => {
            this.errorDiv = false;
          }, 3000);
        }
      })
    } else {
      for (const x in this.signinform.controls) {
        this.signinform.controls[x].markAsTouched();
      }
    }
  }
  signuplink () {
    this.router.navigateByUrl('/signup');
  }
  forgotpasswordlink() {
    $('#exampleModalCenter').modal('toggle');
  }
  closeModal = () => {
    this.resetPassword.reset();
    $('#exampleModalCenter').modal('toggle');
  }
  onReset = () => {
    if (this.resetPassword.valid) {
      alert('submitted');
    } else {
      for (const x in this.resetPassword.controls) {
        this.resetPassword.controls[x].markAsTouched();
      }
    }
  }
}

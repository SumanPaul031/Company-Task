import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = {
    email: null,
    password: null,
    name: null
  };
  errorMessage: string;

  @ViewChild('registerForm', {static: false}) registerForm: NgForm;

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.form).subscribe((res: HttpResponse<any>) => {
        //@ts-ignore
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl('/login');
      }, (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Failure');
      });
    } else {
      this.errorMessage = 'Please enter valid data';
    }
  }

}

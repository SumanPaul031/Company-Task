import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = {
    email: null,
    password: null
  };

  returnUrl: string;

  @ViewChild('loginForm', {static: false}) loginForm: NgForm;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.returnUrl = paramMap.get('returnUrl');
    })
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.form).subscribe(() => {
        let url = this.returnUrl ? this.returnUrl : '/'; 
        this.router.navigateByUrl(url);
      }, err => {
        this.toastr.error(err.error.message, 'Failure');
      });
    } else {
      this.toastr.error('Please enter valid data', 'Failure');
    }
  }

}

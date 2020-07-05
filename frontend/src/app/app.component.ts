import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Onboard Company';
  user$: Observable<User>;
  user: User;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void{
    this.user$ = this.authService.getCurrentUser().pipe(share());
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

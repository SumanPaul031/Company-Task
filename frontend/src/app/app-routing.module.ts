import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OnboardingformComponent } from './components/onboardingform/onboardingform.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'onboarding' },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'onboardingform/:id', component: OnboardingformComponent, canActivate: [AuthGuard] },
  { path: 'thankyou', component: ThankYouComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'onboarding' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

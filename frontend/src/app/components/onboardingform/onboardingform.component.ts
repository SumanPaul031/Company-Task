import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-onboardingform',
  templateUrl: './onboardingform.component.html',
  styleUrls: ['./onboardingform.component.css']
})
export class OnboardingformComponent implements OnInit {

  id;
  companyName;

  serviceProvider = new FormControl('Perilwise Insurtech Pvt Ltd');
  venderConstitution = new FormControl('Insurtech provider');
  Indian_Foreign = new FormControl('Indian Entity');
  Nature_scope = new FormControl('Managed IT services');
  services_licensing = new FormControl('Fully managed service provided by vendor for Abhivridhi');
  source_BAGIC = new FormControl('No.  Source code will not be with BAGIC');
  on_offsite = new FormControl('off site');
  servers = new FormControl('Servers are in India');
  approved = new FormControl('Approved');
  agreement_period = new FormControl('2 years');
  auto_renewal = new FormControl('Yes');
  other_conditions = new FormControl('No');
  signing_authority = new FormControl('Avinash Ramachandran');

  itVenderNameAddress = new FormControl('Perilwise Insurtech Pvt Ltd');
  itSpocMobileEmail = new FormControl('Sunil Gopikrishna (sunil@perilwise.tech/9884475674)');
  itPlatform = new FormControl('Angular/Python');

  confidential_info = new FormControl('', [Validators.required]);
  NDA = new FormControl('', [Validators.required]);
  SOW = new FormControl('', [Validators.required]);
  terminate = new FormControl('', [Validators.required]);
  MOU_valid = new FormControl('', [Validators.required]);
  MOU_period = new FormControl('', [Validators.required]);
  BAGIC_signing_authority = new FormControl('', [Validators.required]);
  existing_agreement = new FormControl('', [Validators.required]);
  other_aspects = new FormControl('', [Validators.required]);

  company_name_address = new FormControl('', [Validators.required]);
  spocName_mobile_email = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  publicIP = new FormControl('', [Validators.required]);

  constructor(private activatedRoute: ActivatedRoute, private companyService: CompanyService, private router: Router, private toastr: ToastrService) { 
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    })
  }

  ngOnInit() {
    this.companyService.getCompany(this.id).subscribe((res: HttpResponse<any>) => {
      //@ts-ignore
      this.companyName = res.companyName;
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  onBoard(){
    let data = {
      confidential_info: this.confidential_info.value,
      NDA: this.NDA.value,
      SOW: this.SOW.value,
      terminate: this.terminate.value,
      MOU_valid: this.MOU_valid.value,
      MOU_period: this.MOU_period.value,
      BAGIC_signing_authority: this.BAGIC_signing_authority.value,
      existing_agreement: this.existing_agreement.value,
      other_aspects: this.other_aspects.value,
      company_name_address: this.company_name_address.value,
      spocName_mobile_email: this.spocName_mobile_email.value,
      start_date: this.start_date.value,
      end_date: this.end_date.value,
      publicIP: this.publicIP.value
    };

    this.companyService.onboardCompany(this.id, data).subscribe((res: HttpResponse<any>) => {
      //@ts-ignore
      this.toastr.success(res.message, 'Success');
      this.router.navigate(['/thankyou']);
    }, (err: HttpErrorResponse) => {
      this.toastr.error(err.error.message, 'Failure');
    });
  }

}

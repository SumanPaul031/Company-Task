import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  companyName = new FormControl('', [Validators.required]);
  contactPerson = new FormControl('', [Validators.required]);
  contactEmail = new FormControl('', [Validators.required]);
  companyAddress = new FormControl('', [Validators.required]);
  // products = new FormControl([], [Validators.required]);

  user: User;
  userSub: Subscription;

  products: FormGroup;
  Products: Array<any> = [
    { name: 'Car', value: 'Car' },
    { name: 'Bike', value: 'Bike' },
    { name: 'PA', value: 'PA' },
    { name: 'Travel', value: 'Travel' },
    { name: 'Health', value: 'Health' }
  ];

  noOnboardedCompanies: boolean;
  onboardedCompanies = [];
  selectedCompany;

  // Onboarded Company Details
  serviceProvider;
  venderConstitution;
  Indian_Foreign;
  Nature_scope;
  services_licensing;
  source_BAGIC;
  on_offsite;
  servers;
  approved;
  agreement_period;
  auto_renewal;
  other_conditions;
  signing_authority;
  itVenderNameAddress;
  itSpocMobileEmail;
  itPlatform;
  confidential_info;
  NDA;
  SOW;
  terminate;
  MOU_valid;
  MOU_period;
  BAGIC_signing_authority;
  existing_agreement;
  other_aspects;
  company_name_address;
  spocName_mobile_email;
  start_date;
  end_date;
  publicIP;

  constructor(private fb: FormBuilder, private authService: AuthService, private companyService: CompanyService, private toastr: ToastrService) { 
    this.products = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user: User) => {
      this.user = user;
    });

    this.getOnboardedCompanies();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  getOnboardedCompanies(){
    this.companyService.getAllCompanies().subscribe((res: HttpResponse<any>) => {
      //@ts-ignore
      if(res.length <= 0){
        this.noOnboardedCompanies = true;
      } else{
        this.noOnboardedCompanies = false;
        //@ts-ignore
        res.forEach(company => {
          if(company != null){
            this.onboardedCompanies.push(company);
          }
        })
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  companyClick(id: string){
    this.selectedCompany = id;
    this.companyService.getOnboardedCompany(id).subscribe((res: onboardedCompanyResponse) => {
      this.serviceProvider = res.serviceProvider;
      this.venderConstitution = res.venderConstitution;
      this.Indian_Foreign = res.Indian_Foreign;
      this.Nature_scope = res.Nature_scope;
      this.services_licensing = res.services_licensing;
      this.source_BAGIC = res.source_BAGIC;
      this.on_offsite = res.on_offsite;
      this.servers = res.servers;
      this.approved = res.approved;
      this.agreement_period = res.agreement_period;
      this.auto_renewal = res.auto_renewal;
      this.other_conditions = res.other_conditions;
      this.signing_authority = res.signing_authority;      
      this.confidential_info = res.confidential_info;
      this.NDA = res.NDA;
      this.SOW = res.SOW;
      this.terminate = res.terminate;
      this.MOU_valid = res.MOU_valid;
      this.MOU_period = res.MOU_period;
      this.BAGIC_signing_authority = res.BAGIC_signing_authority;
      this.existing_agreement = res.existing_agreement;
      this.other_aspects = res.other_aspects;


      this.company_name_address = res.partner.company_name_address;
      this.spocName_mobile_email = res.partner.spocName_mobile_email;
      this.itVenderNameAddress = res.partner.itVenderNameAddress;
      this.itSpocMobileEmail = res.partner.itSpocMobileEmail;
      this.itPlatform = res.partner.itPlatform;
      this.start_date = res.partner.start_date;
      this.end_date = res.partner.end_date;
      this.publicIP = res.partner.publicIP;
    })
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.products.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  companyNameErrorMessage(){
    if (this.companyName.hasError('required')) {
      return 'You must enter a Company Name';
    } else {
      return '';
    }
  }

  contactPersonErrorMessage(){
    if (this.contactPerson.hasError('required')) {
      return 'You must enter the contact person';
    } else {
      return '';
    }
  }

  contactEmailErrorMessage(){
    if (this.contactEmail.hasError('required')) {
      return 'You must enter the contact email';
    } else {
      return '';
    }
  }

  companyAddressErrorMessage(){
    if (this.contactEmail.hasError('required')) {
      return 'You must enter the company address';
    } else {
      return '';
    }
  }

  CreateCompany(){
    console.log(this.companyName.value);
    console.log(this.products.value.checkArray)
    let data = {
      companyName: this.companyName.value,
      contactPerson: this.contactPerson.value,
      contactEmail: this.contactEmail.value,
      address: this.companyAddress.value,
      products: this.products.value.checkArray
    };

    this.companyService.createCompany(data).subscribe((res: HttpResponse<any>) => {
      this.toastr.success('Mail Sent to the Contact Email', 'Company Created!!!');
      document.getElementById('openCompany').click();
      this.companyName.setValue('');
      this.contactPerson.setValue('');
      this.contactEmail.setValue('');
      this.companyAddress.setValue('');
    }, err => {
      console.log(err.error);
      this.toastr.error(err.error.message, 'Failure');
    });
  }

}

interface onboardedCompanyResponse{
  serviceProvider: string;
  venderConstitution: string;
  Indian_Foreign: string;
  Nature_scope: string;
  services_licensing: string;
  source_BAGIC: string;
  on_offsite: string;
  servers: string;
  approved: string;
  agreement_period: string;
  auto_renewal: string;
  other_conditions: string;
  signing_authority: string;  
  confidential_info: string;
  NDA: string;
  SOW: string;
  terminate: string;
  MOU_valid: Date;
  MOU_period: string;
  BAGIC_signing_authority: string;
  existing_agreement: string;
  other_aspects: string;
  partner: {
    company_name_address: string;
    spocName_mobile_email: string;
    itVenderNameAddress: string;
    itSpocMobileEmail: string;
    itPlatform: string;
    start_date: Date;
    end_date: Date;
    publicIP: string;
  }
}
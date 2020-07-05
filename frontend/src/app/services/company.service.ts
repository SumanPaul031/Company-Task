import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  createCompany(data: {companyName: string; contactPerson: string, contactEmail: string, address: string, products: Array<String>}) {
    return this.http.post(`/api/company`, data);
  }

  getAllCompanies(){
    return this.http.get(`/api/company`);
  }

  getCompany(companyId: string){
    return this.http.get(`/api/company/${companyId}`);
  }

  onboardCompany(companyId: string, data: { confidential_info: string, NDA: string, SOW: string, terminate: string, MOU_valid: Date, MOU_period: string, BAGIC_signing_authority: string, existing_agreement: string, other_aspects: string, company_name_address: string, spocName_mobile_email: string, start_date: Date, end_date: Date, publicIP: string }){
    return this.http.post(`/api/company/${companyId}`, data);
  }

  getOnboardedCompany(companyId: string){
    return this.http.get(`/api/company/onboarded/${companyId}`);
  }
}

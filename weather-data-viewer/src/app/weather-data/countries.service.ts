import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Country } from '../interfaces/Country';

@Injectable()
export class CountriesService {
  constructor(private http: HttpClient) {
  }

  fetchCountries(returnResponse: (response: Country[]) => void) {
    const url = 'https://restcountries.eu/rest/v2/all'
    this.http.get<any[]>(url).subscribe(
      (response) => returnResponse(
        this.convertToCountryArray(response)));
  }

  convertToCountryArray(httpResponse: any[]) : Country[] {
    const countries: Country[] = httpResponse.map(
      element => {
        return {
          country: element.name,
          countryCode: element.alpha2Code
        } as Country
      }
    );
    return countries;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CurrentWeather } from '../interfaces/CurrentWeather';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { getLocaleDateTimeFormat } from '@angular/common';


@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {
  }

  fetchCurrentWeather(city: string, countryCode: string, returnResponse: (response: CurrentWeather | number) => void) {
    const apiKey = environment.openWeatherMap.apiKey;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='
              + city + ',' + countryCode + '&appid=' + apiKey + '&units=metric';

    this.http.get<any>(url).subscribe(
      (response) => returnResponse(this.convertToCurrentWeather(response)),
      (resp) => returnResponse((resp as HttpErrorResponse).status));
  }

  convertToCurrentWeather(httpResponse: any): CurrentWeather {
    const time = httpResponse.dt;
    const targetTime = new Date(time * 1000);

    return {
      dateUpdated: targetTime,
      weatherIcon: httpResponse.weather[0].icon,
      city: httpResponse.name,
      temperature: httpResponse.main.temp,
      countryCode: httpResponse.sys.country,
    }
  }
}

import { Injectable } from '@angular/core';
import { formatNumber } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CurrentWeather } from '../interfaces/CurrentWeather';
import { WeatherForecast } from '../interfaces/WeatherForecast';
import { DailyWeather } from '../interfaces/DailyWeather';

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {
  }

  /**
   * Fetches the current weather for a given city in a given country
   * based on its country code. The callback function returns a
   * CurrentWeather object or a status code.
   * 
   * @param city            The city
   * @param countryCode     The country code
   * @param returnResponse  A callback back to the weather forecast component
   */
  fetchCurrentWeather(city: string, countryCode: string, returnResponse: (response: CurrentWeather | number) => void) {
    const apiKey = environment.openWeatherMap.apiKey;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='
              + city + ',' + countryCode + '&appid=' + apiKey + '&units=metric';

    this.http.get<any>(url).subscribe(
      (response) => returnResponse(this.convertToCurrentWeather(response)),
      (resp) => returnResponse((resp as HttpErrorResponse).status));
  }

  /**
   * Returns a CurrentWeather interface object including
   * the current weather data.
   * 
   * @param httpResponse the API response from openweathermap.org
   */
  convertToCurrentWeather(httpResponse: any): CurrentWeather {
    const time = httpResponse.dt;
    const targetTime = new Date(time * 1000);

    let temp: number = httpResponse.main.temp;
    temp = parseFloat(formatNumber(temp, 'en-US', '1.0-0'));

    return {
      dateUpdated: targetTime,
      weatherIcon: httpResponse.weather[0].icon,
      city: httpResponse.name,
      temperature: temp,
      countryCode: httpResponse.sys.country,
    }
  }

  /**
   * Fetches a 5-day weather forecast for a given city in a given country
   * and returns the response as a WeatherForecast object or as a status code
   * utilizing a callback function.
   * 
   * @param city            The city
   * @param countryCode     The country code
   * @param returnResponse  A callback back to weather forecast component
   */
  fetchWeatherForecastFor(city: string, countryCode: string, returnResponse: (response: WeatherForecast | number) => void) {
    const apiKey = environment.openWeatherMap.apiKey;
    const url = 'https://api.openweathermap.org/data/2.5/forecast?q='
              + city + ',' + countryCode + '&appid=' + apiKey + '&units=metric';

    this.http.get<any>(url).subscribe(
      (response) => {
        returnResponse(this.convertToWeatherForecast(response));
      }, (resp) => returnResponse((resp as HttpErrorResponse).status)
    );
  }

  /**
   * Returns the WeatherForecast interface object including
   * 5 - 6 daily forecasts.
   * 
   * @param httpResponse The API response from openweathermap.org
   */
  convertToWeatherForecast(httpResponse: any): WeatherForecast {

    const cityName: string = httpResponse.city.name;
    const cc: string = httpResponse.city.country;
    const dailyWeather: DailyWeather[] = [];
    let temps: number[] = [];
    let targetTimes: Date[] = [];
    let dayIdx = 0;
    let max: number;
    let min: number;

    const forecastArray: DailyWeather[] = [];

    httpResponse.list.map((item, index) => {

      const time = item.dt;
      const targetTime = new Date(time * 1000);
      targetTimes.push(targetTime);

      let temp: number = item.main.temp;
      temp = parseFloat(formatNumber(temp, 'en-US', '1.0-0'));
      temps.push(temp);

      if (index === 0) {
        max = temp;
        min = temp;
      }

      /**
       * If the target time is midnight GMT
       * or if the last index was reached,
       * set all the forecasts within one
       * day to a new index in the forecast array
       */
      if (targetTime.getHours() === 0 || index === httpResponse.list.length - 1) {

        const newMax = Math.max(...temps);
        if (newMax > max) {
          max = newMax;
        }
        const newMin = Math.min(...temps);
        if (newMin < min) {
          min = newMin;
        }

        dailyWeather.push(
          {
            datesUpdated: targetTimes,
            temperatures: temps,
          } as DailyWeather
        );

        forecastArray[dayIdx] = dailyWeather[dayIdx];

        temps.slice(0, temps.length);
        temps = [];
        targetTimes.slice(0, targetTimes.length);
        targetTimes = [];
        dayIdx++;
      }
    });

    return {
      countryCode: cc,
      city: cityName,
      minTemp: min,
      maxTemp: max,
      forecast: forecastArray
    } as WeatherForecast;
  }
}

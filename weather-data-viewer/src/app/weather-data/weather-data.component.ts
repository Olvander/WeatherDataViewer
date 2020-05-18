import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather-data/weather.service';
import { CountriesService } from './countries.service';
import { formatDate } from '@angular/common';
import { Country } from '../interfaces/Country';
import { CurrentWeather } from '../interfaces/CurrentWeather';
import { WeatherForecast } from '../interfaces/WeatherForecast';

@Component({
  selector: 'app-weather-data',
  templateUrl: './weather-data.component.html',
  styleUrls: ['./weather-data.component.css']
})

/**
 * Displays the basic UI and optionally
 * the current weather or a weather forecast.
 */
export class WeatherDataComponent implements OnInit {
  title = 'Weather Data Viewer';

  city = '';
  country: string;
  countries: Country[];
  weather: string;
  currentWeather: CurrentWeather;
  forecast: WeatherForecast;
  noDataFound: string;
  showCurrentWeather: boolean;
  showWeatherForecast: boolean;
  dateString: string;

  constructor(private weatherService: WeatherService,
              private countriesService: CountriesService) {
    this.country = 'Select a country';
    this.countries = [];
    this.weather = 'Display current weather';
    this.noDataFound = '';
    this.showCurrentWeather = false;
    this.showWeatherForecast = false;
  }

  ngOnInit(): void {
    this.countriesService.fetchCountries(result => {
      this.countries = result;
    });
  }

  fetchWeatherData(): void {
    if (this.city.length > 0) {
      if (this.country !== 'Select a country') {

        const countryCode = this.countries.filter((c) => c.country === this.country &&
                              this.country.length === c.country.length)[0].countryCode;

        if (this.weather === 'Display current weather') {

          this.fetchCurrentWeatherData(countryCode);

        } else if (this.weather === 'Display weather forecast') {

          this.fetchWeatherForecastData(countryCode);
        }
      }
    }
  }

  fetchCurrentWeatherData(countryCode: string): void {
    this.weatherService.fetchCurrentWeather(this.city, countryCode, result => {

      if ((result as CurrentWeather).city !== undefined) {
        const weatherData: CurrentWeather = result as CurrentWeather;
        this.currentWeather = weatherData;

        this.setValuesForDateUpdated(weatherData);
        this.showCurrentWeather = true;
        this.showWeatherForecast = false;
        this.noDataFound = '';

      } else {
        this.noDataFound = 'Could not find the specified location';
        this.currentWeather = null;
        this.showCurrentWeather = false;
      }
    });
  }

  fetchWeatherForecastData(countryCode: string): void {
    this.weatherService.fetchWeatherForecastFor(this.city, countryCode, result => {

      if ((result as WeatherForecast).forecast !== undefined) {
        const weatherForecast: WeatherForecast = result as WeatherForecast;
        this.forecast = weatherForecast;

        this.currentWeather = null;
        this.showCurrentWeather = false;
        this.showWeatherForecast = true;
        this.noDataFound = '';
      } else {
        this.noDataFound = 'Could not find the specified location';
        this.currentWeather = null;
        this.showCurrentWeather = false;
        this.showWeatherForecast = false;
      }
    });
  }

  setValuesForDateUpdated(weatherData: CurrentWeather): void {
    const t: Date = weatherData.dateUpdated;
    const ampm = t.getHours() >= 12 ? 'PM' : 'AM';
    this.dateString = 'Date updated: ' + formatDate(t, 'MMMM d yyyy h:mm ', 'en-us') + ampm;
  }
}

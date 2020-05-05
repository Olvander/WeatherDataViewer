import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather-data/weather.service';
import { CountriesService } from '../weather-data/countries-service';
import { formatDate } from '@angular/common';
import { Country } from '../interfaces/Country';
import { CurrentWeather } from '../interfaces/CurrentWeather';

@Component({
  selector: 'app-weather-data',
  templateUrl: './weather-data.component.html',
  styleUrls: ['./weather-data.component.css']
})
export class WeatherDataComponent implements OnInit {
  title = 'Weather Data Viewer';

  city = '';
  country;
  countries: Country[];
  weather;
  currentWeather: CurrentWeather;
  noDataFound: string;
  showCurrentWeather: boolean;
  dateString;

  constructor(private weatherService: WeatherService,
              private countriesService: CountriesService) {
    this.country = "Select a country";
    this.countries = [];
    this.weather = 'Display current weather';
    this.noDataFound = '';
    this.showCurrentWeather = false;
  }

  ngOnInit(): void {
    this.countriesService.fetchCountries(result => {
      this.countries = result;
    });
  }

  fetchWeatherData() : void {
    if (this.city.length > 0) {
      if (this.country !== "Select a country") {
        if (this.weather === 'Display current weather') {
          const countryCode = this.countries.filter((c) => c.country === this.country &&
                              this.country.length === c.country.length)[0].countryCode;
          this.weatherService.fetchCurrentWeather(this.city, countryCode, result => {

            if ((result as CurrentWeather).city !== undefined) {
              const weatherData: CurrentWeather = result as CurrentWeather;
              this.currentWeather = weatherData;

              this.setValuesForDateUpdated(weatherData);
              this.showCurrentWeather = true;
              this.noDataFound = '';

            } else {
              this.noDataFound = 'Could not find the specified location';
              this.currentWeather = null;
              this.showCurrentWeather = false;
            }
          });
        } else if (this.weather === 'Display weather forecast') {
          this.currentWeather = null;
          this.showCurrentWeather = false;
        }
      }
    }
  }
  setValuesForDateUpdated(weatherData: CurrentWeather) : void {
    const t: Date = weatherData.dateUpdated;
    const ampm = t.getHours() >= 12 ? "PM" : "AM";
    this.dateString = 'Date updated: ' + formatDate(t, 'MMMM d yyyy h:mm ', 'en-us') + ampm;
  }
}

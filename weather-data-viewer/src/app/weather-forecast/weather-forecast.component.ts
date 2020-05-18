import { Component, Input, OnInit } from '@angular/core';
import { WeatherForecast } from '../interfaces/WeatherForecast';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})

/**
 * Displays the line charts component with
 * weather data for each of the 5 - 6 days.
 */
export class WeatherForecastComponent implements OnInit {

  @Input() forecast: WeatherForecast;

  constructor() { }

  ngOnInit(): void {
  }
}

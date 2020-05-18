import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CurrentWeather } from '../interfaces/CurrentWeather';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnChanges {

  @Input() currentWeather: CurrentWeather;
  @Input() dateString: string;
  weatherIconPath;
  temperatureText;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.temperatureText = this.currentWeather.temperature > 0 ? '+' + this.currentWeather.temperature :
      this.currentWeather.temperature;
    this.weatherIconPath = `http://openweathermap.org/img/wn/${this.currentWeather.weatherIcon}@2x.png`;
  }
}

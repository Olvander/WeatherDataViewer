import { Component, OnInit, Input } from '@angular/core';
import { DailyWeather } from '../interfaces/DailyWeather';

@Component({
  selector: 'app-line-charts',
  templateUrl: './line-charts.component.html',
  styleUrls: ['./line-charts.component.css']
})
export class LineChartsComponent implements OnInit {

  dataArePresent = false;
  @Input() weatherDataArray: DailyWeather[];
  @Input() minTemp: number;
  @Input() maxTemp: number;

  constructor() {
  }

  // Weather data have been fetched so line charts can now be displayed
  ngOnInit(): void {
    this.dataArePresent = true;
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WeatherDataComponent } from './weather-data/weather-data.component';
import { WeatherService } from './weather-data/weather.service';
import { CountriesService } from './weather-data/countries.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LineChartsComponent } from './line-charts/line-charts.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    WeatherDataComponent,
    CurrentWeatherComponent,
    WeatherForecastComponent,
    LineChartComponent,
    LineChartsComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, ChartsModule
  ],
  providers: [WeatherService, CountriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { DailyWeather } from './DailyWeather';

export interface WeatherForecast {
  countryCode: string;
  city: string;
  minTemp: number;
  maxTemp: number;
  forecast: DailyWeather[];
}

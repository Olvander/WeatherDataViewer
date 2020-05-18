import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DailyWeather } from '../interfaces/DailyWeather';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
  export class LineChartComponent implements OnInit {

    @Input() weatherData: DailyWeather;
    @Input() maxTemp: number;
    @Input() minTemp: number;
    dataArePresent = false;

    public lineChartData: ChartDataSets[] = [
    ];
    public lineChartLabels: Label[] = ['3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
    public lineChartOptions: (ChartOptions) = {

      responsive: false,
      title: {
        text: '',
        fontColor: 'white',
        fontFamily: 'Calibri, sans-serif',
        fontSize: 20,
        display: true,
      },
      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'top',
          color: 'white',
          font: {
            family: 'Calibri, sans-serif',
            size: 16,
            weight: 'bold',
          },
          formatter: (val, context) => {
            return this.formatValue(val);
          }
        }
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'white',
              fontSize: 14,
              fontFamily: 'Calibri, sans-serif',
              padding: 5,
            },
            offset: true,
            gridLines: {
              tickMarkLength: 0,
            },
          }
        ],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'left',
            gridLines: {
              color: 'rgba(255,255,255,0.8)',
              tickMarkLength: 0,
              zeroLineColor: '#ffffffcc',
              zeroLineWidth: 3,
            },
            ticks: {
              fontColor: 'white',
              fontSize: 14,
              fontFamily: 'Calibri, sans-serif',
              max: this.maxTemp,
              min: this.minTemp,
              stepSize: 10,
              padding: 5,
            }
          }
        ]
      },
    };
    public lineChartColors: Color[] = [
      {
        backgroundColor: 'transparent',
        borderColor: 'gold',
        pointBackgroundColor: 'white',
        pointBorderColor: 'white',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: 'white',
      },
    ];
    public lineChartLegend = false;
    public lineChartType = 'line';
    public lineChartPlugins = [ChartDataLabels];

    @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

    constructor() {
     }

    ngOnInit() {
      this.initializeLineChartOptions();

      const dataArr: number[] = this.initializeDataArray();

      this.lineChartData = [{
        data: dataArr, label: '', lineTension: 0,
      }];

      this.dataArePresent = true;
    }

    /**
     * Return temperatures array if its length is 8,
     * otherwise push null values to the beginning or end of the array.
     */
    initializeDataArray(): number[] {
      let dataArr: number[] = [];

      if (this.weatherData.temperatures.length < 8) {

        // If this is the last line chart, fill remaining values with null
        if ((this.formatTime(this.weatherData.datesUpdated[0]) +
            this.getAMPM(this.weatherData.datesUpdated[0])) === '3AM') {

          dataArr = this.weatherData.temperatures;

          while (dataArr.length < 8) {
            dataArr.push(null);
          }

          // If this is the first line chart, fill the beginning with null
        } else {
          while (dataArr.length < 8 - this.weatherData.temperatures.length) {
            dataArr.push(null);
          }
          this.weatherData.temperatures.map((data) => {
            dataArr.push(data);
          });
        }
      } else {
        dataArr = this.weatherData.temperatures;
      }
      return dataArr;
    }

    initializeLineChartOptions(): void {
      this.setMinAndMaxForYAxis();
      this.setTitle();
    }

    setMinAndMaxForYAxis(): void {
      this.lineChartOptions.scales.yAxes[0].ticks.min = this.roundDownToTens(this.minTemp);
      this.lineChartOptions.scales.yAxes[0].ticks.max = this.roundUpToTens(this.maxTemp);
    }

    setTitle(): void {
      this.lineChartOptions.title.text = this.getFormattedDate(this.weatherData.datesUpdated[0]);
      this.lineChartOptions.title.fontSize = 20;
    }

    /**
     * Sets the upper limit at the precision of 10 above the maximum
     * temperature of the whole forecast. Same values for each line chart.
     * @param max The common maximum temperature of the forecast
     */
    roundUpToTens(max: number): number {
      let roundedNumber = max;
      if (max === 0) {
        return 10;
      } else {
        while (roundedNumber % 10 !== 0) {
          roundedNumber = Math.ceil(roundedNumber + 0.5);
        }
      }
      if (roundedNumber - max < 5) {
        roundedNumber += 10;
      }
      return roundedNumber;
    }

    /**
     * Sets the lower limit at the precision of 10 below the minimum
     * temperature of the whole forecast. Same values for each line chart.
     * @param min The common minimum temperature of the forecast
     */
    roundDownToTens(min: number): number {
      let roundedNumber = min;
      if (roundedNumber === 0) {
        return -10;
      } else {
        while (roundedNumber % 10 !== 0) {
          roundedNumber = Math.floor(roundedNumber - 0.5);
        }
      }
      if (min - roundedNumber < 5) {
        roundedNumber -= 10;
      }
      return roundedNumber;
    }

    formatValue(value: any) {
      return value + '°C';
    }

    formatTimes(dates: Date[]): string[] {
      return dates.map((d) => {
        return this.formatTime(d) + ' ' + this.getAMPM(d);
      });
    }

    formatTime(d: Date): string {
      return formatDate(d, 'h', 'en-us');
    }

    getAMPM(t: Date): string {
      return t.getHours() >= 12 ? 'PM' : 'AM';
    }

    getLongWeekDay(t: Date): string {
      return t.toLocaleDateString('en-US', {weekday: 'long'});
    }

    getDate(t: Date): string {
      return t.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    getFormattedDate(t: Date): string {
      return this.getLongWeekDay(t) + ' ' + this.getDate(t);
    }
  }

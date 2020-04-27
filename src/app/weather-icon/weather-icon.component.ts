import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-weather-icon',
  templateUrl: './weather-icon.component.html',
  styleUrls: ['./weather-icon.component.sass']
})
export class WeatherIconComponent implements OnInit {

  public icon: string = "weather";
  public _code: number;

  @Input() set code(value: number) {
    this._code = value;
    this.icon = null;

    console.log(value)
    if (this._code >= 200 && this._code <= 250) { this.icon = "thunder"; } 
    if (this._code >= 300 && this._code <= 550) { this.icon = "rainy-4"; }
    if (this._code == 600) this.icon = "snowy-4"; if (this._code == 601) this.icon = "snowy-5"; 
    if (this._code > 601 && this._code <= 650) this.icon = "snowy-6";
    if (this._code == 800) this.icon = "day";
    if(this._code == 601) this.icon = "snowy-5"; 
  };
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Weather } from '../structures/weather.stucture';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnInit {

  @Input() weather: Weather;
  constructor() { }

  ngOnInit() {
  }

}

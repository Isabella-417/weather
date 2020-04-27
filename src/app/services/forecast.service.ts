import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coords } from '../structures/coords.structure';
import { map } from 'rxjs/operators';
import { Weather } from '../structures/weather.stucture';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  public weatherSubject: Subject<any> = new Subject<any>();
  public weather$: Observable<any>;

  public endpoint: string = "https://api.openweathermap.org/data/2.5/forecast";

  constructor(private http: HttpClient, private geolocationService: GeolocationService) {
    this.weather$ = this.weatherSubject.asObservable().pipe(map(this.stuctureData));

    this.geolocationService.coords.subscribe((coords) => {
      this.get(coords);
    });
  }

  stuctureData(data: any) {
    let minMaxPerDay = {};

    data.list.forEach(weatherObject => {
      let date = new Date(weatherObject.dt * 1000);
      let hours = date.getHours();
      let month = date.getMonth();
      let day = date.getDate();
      let key = `${month}-${day}`;

      let tempPerDay: Weather = minMaxPerDay[key] || {
        minMaxTemp: {}
      }

      if (!tempPerDay.cod || hours == 16) {
        let source = weatherObject.weather[0];
        tempPerDay = { ...tempPerDay, ...source };
        tempPerDay.cod = source.id;
        tempPerDay.name = data.city.name;
      }

      if (!tempPerDay.minMaxTemp.min || (tempPerDay.minMaxTemp.min < weatherObject.main.temp_min)) {
        tempPerDay.minMaxTemp.min = weatherObject.main.temp_min;
      }

      if (!tempPerDay.minMaxTemp.max || (weatherObject.main.temp_max > tempPerDay.minMaxTemp.max)) {
        tempPerDay.minMaxTemp.max = weatherObject.main.temp_max;
      }
      minMaxPerDay[key] = tempPerDay;
    });
    return Object.values(minMaxPerDay);
  }

  get(coords: Coords) {
    let args: string = `?lat=${coords.lat}&lon=${coords.lon}&APPID=${environment.key}&unit=metrics`;
    let url = this.endpoint + args;

    /*if (isDevMode()) {
      url = 'assets/forecast.json';
    }*/
    let observable = this.http.get(url).subscribe(this.weatherSubject);
  }
}

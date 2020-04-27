import { Injectable } from '@angular/core';
import { Coords } from '../structures/coords.structure';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public coordsSubject: Subject<Coords> = new Subject<Coords>();
  public coords: Observable<Coords> = this.coordsSubject.asObservable();
  public permission$: Promise<string>;
  public coordsPromise: Promise<Coords>;

  constructor() {
    this.permission$ = (navigator as any).permissions.query({ name: 'geolocation' })
      .then(permission => permission.state);
  }

  requestCoords() {
    if (!this.coordsPromise) {
      this.coordsPromise = this.getCoords();
    }
    this.coordsPromise.then(coords => {
      this.coordsSubject.next(coords);
    });
  }

  getCoords(): Promise<Coords> {
    return new Promise((res, rej) => {
      if (!navigator || !["geolocation" in navigator]) rej("Geolocation isn't avalaible");
      navigator.geolocation.getCurrentPosition((position) => {
        res({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      });
    });
  }
}

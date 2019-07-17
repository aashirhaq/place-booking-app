import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      123.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/373/2018/03/26091241/Hotel-Amour-v%C3%A9randa-11.jpg',
      183.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),

    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://i1.trekearth.com/photos/138102/dsc_0681.jpg',
      76.45,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}

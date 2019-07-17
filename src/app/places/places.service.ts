import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      123.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'fake',
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/373/2018/03/26091241/Hotel-Amour-v%C3%A9randa-11.jpg',
      183.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'fake',
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://i1.trekearth.com/photos/138102/dsc_0681.jpg',
      76.45,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'fake',
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, fromDate: Date, toDate: Date,) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://media-cdn.tripadvisor.com/media/photo-w/0a/a9/b4/0f/pool-mit-blick-auf-schloss.jpg',
      price,
      fromDate,
      toDate,
      this.authService.userId);

    return this.places.pipe(
      take(1),
      delay(1500),
      tap(places => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(1500), tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );

      this._places.next(updatedPlaces);
    }));
  }
}

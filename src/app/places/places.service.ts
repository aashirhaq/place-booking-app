import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>('https://place-booking-app.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
            ));
          }
        }
        return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
        
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(`https://place-booking-app.firebaseio.com/offered-places/${id}.json`)
      .pipe(
        map(resData => {
          return new Place(
            id,
            resData.title,
            resData.description,
            resData.imageUrl,
            resData.price,
            new Date(resData.availableFrom),
            new Date(resData.availableTo),
            resData.userId
          );
        })
      );
  }

  addPlace(title: string, description: string, price: number, fromDate: Date, toDate: Date, ) {
    
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://media-cdn.tripadvisor.com/media/photo-w/0a/a9/b4/0f/pool-mit-blick-auf-schloss.jpg',
      price,
      fromDate,
      toDate,
      this.authService.userId
    );

    return this.http.post<{name: string}>(
      'https://place-booking-app.firebaseio.com/offered-places.json',
      {
        ...newPlace,
        id: null
      }
    ).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );

    // return this.places.pipe(
    //   take(1),
    //   delay(1500),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {

    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {

        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }

      }),
      switchMap(places => {
        
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
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

        return this.http.put(
          `https://place-booking-app.firebaseio.com/offered-places/${placeId}.json`,
          {
            ...updatedPlaces[updatedPlaceIndex], 
            id: null
          }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );

  }
}

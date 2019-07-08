import { Injectable } from '@angular/core';
import { Booking } from './booking.modal';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings: Booking[] = [
        {
            id: 'b1',
            placeId: 'p1',
            placeTitle: 'Manhattan Mansion',
            userId: 'u1',
            guestNumber: 1
        }
    ];

    get bookings() {
        return [...this._bookings];
    }
}

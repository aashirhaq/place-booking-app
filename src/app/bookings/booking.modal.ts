export class Booking {
    constructor(
        public id: string,
        public placeId: string,
        public userId: string,
        public placeTitle: string,
        public plaeImage: string,
        public firstName: string,
        public lastName: string,
        public guestNumber: number,
        public bookFrom: Date,
        public bookTo: Date
    ) {}
}

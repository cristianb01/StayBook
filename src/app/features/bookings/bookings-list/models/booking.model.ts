import { BookingStatus } from "./booking-status.enum";

export interface Booking {
    id: number;
    userId: number;
    propertyId: number;
    status: BookingStatus;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    createdAt: Date;
}

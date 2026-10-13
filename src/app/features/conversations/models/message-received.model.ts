export interface MessageReceivedDto {
  id: number;
  bookingId: number;
  senderId: number;
  content: string;
  createdAtUtc: string;
}
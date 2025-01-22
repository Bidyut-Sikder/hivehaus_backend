import { Types } from "mongoose"

export type TBooking = {
    date: string,
    slots: Types.ObjectId[],//user can book a room multiple time slots
    room: Types.ObjectId,
    user: Types.ObjectId,
    isConfirmed: string,
    isDeleted: boolean,
    totalAmount?: number
}
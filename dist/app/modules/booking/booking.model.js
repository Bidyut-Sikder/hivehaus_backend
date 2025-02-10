"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
// // this difines what time a room is booked and when it is available
// //anybody can book a room two different time slots
// const slotSchema = new Schema(
//   {
//     _id: { type: Schema.Types.ObjectId, required: true },
//     room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
//     date: { type: Date, required: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     isBooked: { type: Boolean, required: true },
//     __v: { type: Number },
//   },
//   { _id: false }
// );
// const roomSchema = new Schema(
//   {
//     _id: { type: Schema.Types.ObjectId, required: true },
//     name: { type: String, required: true },
//     roomNo: { type: Number, required: true },
//     floorNo: { type: Number, required: true },
//     capacity: { type: Number, required: true },
//     pricePerSlot: { type: Number, required: true },
//     amenities: { type: [String], required: true },
//     isDeleted: { type: Boolean, required: true },
//     __v: { type: Number },
//   },
//   { _id: false }
// );
// const userSchema = new Schema(
//   {
//     _id: { type: Schema.Types.ObjectId, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String },
//     phone: { type: String, required: true },
//     role: { type: String, required: true },
//     address: { type: String, required: true },
//     __v: { type: Number },
//   },
//   { _id: false }
// );
// // Main Booking Schema
// const bookingSchema = new Schema({
//   date: { type: String, required: true },
//   slots: { type: [slotSchema], required: true },
//   room: { type: roomSchema, required: true },
//   user: { type: userSchema, required: true },
//   isConfirmed: { type: String, default: "unconfirmed" },
//   isDeleted: { type: Boolean, default: false },
//   totalAmount: { type: Number, required: true },
//   paymentStatus: { type: String, default: "pending" },
//   __v: { type: Number },
// });
// export const BookingModel = model<TBooking>("Booking", bookingSchema);
// json data
// {
//   "date": "2025-01-25",
//   "slots": [
//     "678f81d5c2e60237fd3a0194",
//     "678f8234c2e60237fd3a019f"
//   ],
//   "room": "678e2f7bd21062f2e5555e51",
//   "user": "6790d06047a03364b30d29c8",
//   "isConfirmed": "pending",
//   "isDeleted": false,
//   "totalAmount": 150.75
// }
//My Boking Model
const bookingSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    slot: { type: mongodb_1.ObjectId, required: true, ref: "Slot" },
    room: { type: mongodb_1.ObjectId, required: true, ref: "Room" },
    user: { type: mongodb_1.ObjectId, required: true },
    isConfirmed: { type: String, default: "unconfirmed" },
    isDeleted: { type: Boolean, default: false },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    __v: { type: Number },
});
exports.BookingModel = (0, mongoose_1.model)("Booking", bookingSchema);

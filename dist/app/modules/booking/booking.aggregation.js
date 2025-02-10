"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggreGationPipeline = void 0;
const booking_model_1 = require("./booking.model");
const aggreGationPipeline = (bookingId, removeUser) => __awaiter(void 0, void 0, void 0, function* () {
    const matching = {
        $match: {
            _id: bookingId, // Replace with your booking ID
        },
    };
    const populateSlots = {
        $lookup: {
            from: "slots", // The name of the slots collection
            localField: "slot", // Field in the booking collection
            foreignField: "_id", // Field in the slots collection
            as: "slotDetails", // The resulting array with slot data
        },
    };
    const populateRoomDetails = {
        $lookup: {
            from: "rooms", // The name of the rooms collection
            localField: "room", // Field in the booking collection
            foreignField: "_id", // Field in the rooms collection
            as: "room", // The resulting array with slot data
        },
    };
    const populateUserDetails = {
        $lookup: {
            from: "users", // The name of the rooms collection
            localField: "user", // Field in the booking collection
            foreignField: "_id", // Field in the rooms collection
            as: "user", // The resulting array with slot data
        },
    };
    // console.log(projections)
    const projection = {
        $project: {
            "user.password": 0,
            "room.image": 0,
        },
    };
    const fulldata = yield booking_model_1.BookingModel.aggregate([
        matching,
        populateSlots,
        populateRoomDetails,
        populateUserDetails,
        projection,
    ]);
    const transformedOutput = Object.assign(Object.assign({}, fulldata[0]), { slot: fulldata[0].slotDetails[0], room: fulldata[0].room[0], 
        // user: fulldata[0].user[0], // Get the first user document
        user: removeUser ? undefined : fulldata[0].user[0], slotDetails: undefined });
    return transformedOutput;
});
exports.aggreGationPipeline = aggreGationPipeline;

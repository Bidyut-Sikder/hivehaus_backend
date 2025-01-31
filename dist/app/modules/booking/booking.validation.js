"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = require("zod");
const zod_createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string(),
        slots: zod_1.z.array(zod_1.z.string()),
        room: zod_1.z.string(),
        user: zod_1.z.string(),
    })
});
exports.bookingValidation = {
    zod_createBookingSchema
};

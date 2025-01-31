"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zod_slotValidation = void 0;
const zod_1 = require("zod");
const zod_timeSchema = zod_1.z.string().refine((time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
}, {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
});
const zod_slotValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        room: zod_1.z.string(),
        date: zod_1.z.string(),
        startTime: zod_timeSchema,
        endTime: zod_timeSchema
    })
});
const zod_updateSlotValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        room: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(),
        startTime: zod_timeSchema.optional(),
        endTime: zod_timeSchema.optional(),
    })
});
exports.zod_slotValidation = {
    zod_slotValidationSchema,
    zod_updateSlotValidationSchema
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomValidation = void 0;
const zod_1 = require("zod");
const zod_roomValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        roomNo: zod_1.z.number().int().positive({ message: 'Room number must be greater than 0' }),
        floorNo: zod_1.z.number().int().positive({ message: 'Floor number must be greater than 0' }),
        capacity: zod_1.z.number().int().min(1, { message: 'Capacity must be at least 1' }),
        pricePerSlot: zod_1.z.number().min(0, { message: 'Price per slot cannot be negative' }),
        amenities: zod_1.z.array(zod_1.z.string()),
        image: zod_1.z.array(zod_1.z.string()).optional(),
        isDeleted: zod_1.z.boolean().optional().default(false).optional()
    })
});
const zod_roomUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        roomNo: zod_1.z.number().int().positive().optional(),
        floorNo: zod_1.z.number().int().positive().optional(),
        capacity: zod_1.z.number().int().min(1).optional(),
        pricePerSlot: zod_1.z.number().min(0).optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        image: zod_1.z.array(zod_1.z.string()).optional(),
        isDeleted: zod_1.z.boolean().optional().default(false).optional(),
    })
});
exports.roomValidation = {
    zod_roomValidationSchema,
    zod_roomUpdateValidationSchema
};

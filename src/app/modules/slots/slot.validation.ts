import { z } from "zod";

const zod_timeSchema = z.string().refine(
    (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    },
    {
        message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    },
);

const zod_slotValidationSchema = z.object({
    body: z.object({
        room: z.string(),
        date: z.string(),
        startTime: zod_timeSchema,
        endTime: zod_timeSchema
    })
})

const zod_updateSlotValidationSchema = z.object({
    body: z.object({
        room: z.string().optional(),
        date: z.string().optional(),
        startTime: zod_timeSchema.optional(),
        endTime: zod_timeSchema.optional(),
    })
})

export const zod_slotValidation = {
    zod_slotValidationSchema,
    zod_updateSlotValidationSchema
}






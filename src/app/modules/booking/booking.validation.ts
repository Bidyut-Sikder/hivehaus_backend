import { z } from "zod";

const zod_createBookingSchema = z.object({
    body: z.object({
        date: z.string(),
        slots: z.array(z.string()),
        room: z.string(),
        user: z.string(),
    })
})

export const bookingValidation = {
    zod_createBookingSchema
}
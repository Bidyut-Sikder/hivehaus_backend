

import { z } from "zod";

const userDataValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(255),
        password: z.string().min(6).max(255),
        phone: z.string().max(20).optional(),
        role: z.enum(['admin', 'user']),
        address: z.string().min(1).max(255).optional()
    })
})

const userDataUpdateValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(255).optional(),
        email: z.string().email().max(255).optional(),
        password: z.string().min(6).max(255).optional(),
        phone: z.string().max(20).optional(),
        role: z.enum(['admin', 'user']).optional(),
        address: z.string().min(1).max(255).optional(),
    })
})

export const userValidation = {
    userDataValidationSchema,
    userDataUpdateValidationSchema
}














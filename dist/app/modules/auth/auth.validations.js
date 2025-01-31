"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userDataValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255),
        email: zod_1.z.string().email().max(255),
        password: zod_1.z.string().min(6).max(255),
        phone: zod_1.z.string().max(20).optional(),
        role: zod_1.z.enum(['admin', 'user']),
        address: zod_1.z.string().min(1).max(255).optional()
    })
});
const userDataUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255).optional(),
        email: zod_1.z.string().email().max(255).optional(),
        password: zod_1.z.string().min(6).max(255).optional(),
        phone: zod_1.z.string().max(20).optional(),
        role: zod_1.z.enum(['admin', 'user']).optional(),
        address: zod_1.z.string().min(1).max(255).optional(),
    })
});
exports.userValidation = {
    userDataValidationSchema,
    userDataUpdateValidationSchema
};

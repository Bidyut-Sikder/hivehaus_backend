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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: {
        type: String,
        enum: ["admin", "user"],
        message: "{VALUE} is not a valid user",
    },
    address: { type: String },
}, 
//prevents data from being printed out as object or json
//but we can access password using user.password in auth.services.ts
{
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            return ret;
        },
    },
    toObject: {
        transform(doc, ret) {
            delete ret.password;
            return ret;
        },
    },
});
//Before saving a User document to the database, the pre("save") middleware hashes the password using bcrypt.
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(process.env.BCRYPT_SALT_ROUNDS));
    });
});
exports.UserModel = (0, mongoose_1.model)("User", exports.userSchema);

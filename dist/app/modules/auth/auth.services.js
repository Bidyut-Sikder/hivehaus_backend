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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const auth_model_1 = require("./auth.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const signUpUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email: payload.email });
    if (user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    const result = yield auth_model_1.UserModel.create(payload);
    return result;
});
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!email || !password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email and password are required");
    }
    const user = yield auth_model_1.UserModel.findOne({ email }).select("+password");
    //here we get console password using console.log(user?.password)
    //but if we do console.log(user) we won't get the password field
    //to get better idea check out auth.model.ts
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your Password is Incorrect");
    }
    const jwtPayload = {
        userId: user._id.toString(),
        role: user.role,
    };
    const token = (0, auth_utils_1.createToken)(jwtPayload, process.env.JWT_SECRET_KEY);
    return { user, token };
});
exports.AuthService = {
    loginUserService,
    signUpUserService,
};

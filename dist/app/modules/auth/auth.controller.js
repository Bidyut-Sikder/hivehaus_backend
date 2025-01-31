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
exports.AuthController = void 0;
const auth_services_1 = require("./auth.services");
const TryCatchError_1 = __importDefault(require("../../utils/TryCatchError"));
const auth_utils_1 = require("./auth.utils");
const createUser = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthService.signUpUserService(req.body);
    const token = (0, auth_utils_1.createToken)({ userId: result.id, role: result.role }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, {
        // secure:true,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "User Registered successfully",
        data: result,
        token,
    });
}));
const loginUser = (0, TryCatchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthService.loginUserService(req.body);
    const { user, token } = result;
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({
        success: true,
        message: "User Logged in successfully",
        data: result,
    });
}));
exports.AuthController = {
    createUser,
    loginUser
};

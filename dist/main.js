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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config/config"));
const app_1 = __importDefault(require("./app"));
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.NODE_ENV === "development") {
                yield mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING_DEV);
                console.log("Connecting to MongoDB Development");
                server = app_1.default.listen(process.env.PORT, () => {
                    console.log(`Workspace is listing on port ${config_1.default.port}`);
                });
                return;
            }
            yield mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
            console.log("connected to production");
            server = app_1.default.listen(process.env.PORT, () => {
                console.log(`Workspace is listing on port ${config_1.default.port}`);
            });
            console.log("Mongodb is connected");
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();

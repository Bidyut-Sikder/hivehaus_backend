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
exports.upload = exports.uploadToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const uploadToCloudinary = (imageFiles) => __awaiter(void 0, void 0, void 0, function* () {
    //upload images to cloudinary
    const imagesPromises = imageFiles.map((image) => __awaiter(void 0, void 0, void 0, function* () {
        const base64 = image.buffer.toString("base64");
        // const base64 = Buffer.from(image.buffer).toString("base64");
        const uploadedImage = yield cloudinary_1.v2.uploader.upload(`data:${image.mimetype};base64,${base64}`, //image Path (dynamicaly stores image in memory)
        {
            // format: "webp",
            folder: "HiveHaus", //cloudinary images folder name
        });
        return uploadedImage.secure_url;
    }));
    const imagesUrls = yield Promise.all(imagesPromises);
    return imagesUrls;
});
exports.uploadToCloudinary = uploadToCloudinary;
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, //5mb file size
    },
});

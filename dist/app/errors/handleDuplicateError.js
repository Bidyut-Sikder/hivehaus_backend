"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const errorSources = [
        {
            path: "",
            message: err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: err.message,
        errorSources,
    };
};
exports.default = handleDuplicateError;

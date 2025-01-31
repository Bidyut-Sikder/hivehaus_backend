"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// error that comes from database is called caseError.
const handleCastError = (err) => {
    const errorSources = [{
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err === null || err === void 0 ? void 0 : err.message
        }];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid Error',
        errorSources,
    };
};
exports.default = handleCastError;

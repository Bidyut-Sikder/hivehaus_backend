import mongoose from "mongoose";
import { TErrorSource, TGenericResponse } from "./error.interfaces";




// error that comes from database is called caseError.
const handleCastError = (err: mongoose.Error.CastError) : TGenericResponse => {
    const errorSources: TErrorSource = [{
        path: err?.path,
        message: err?.message
    }]

    const statusCode = 400

    return {
        statusCode,
        message: 'Invalid Error',
        errorSources,
    }
}


export default handleCastError 
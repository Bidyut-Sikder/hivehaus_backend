import { TErrorSource, TGenericResponse } from "./error.interfaces";



const handleDuplicateError = (err: any): TGenericResponse => {
    console.log(err);
    const errorSources: TErrorSource = [
        {
            path: '',
            message: err.message
        }
    ]

    const statusCode = 400

    return {
        statusCode,
        message: err.message,
        errorSources,
    }

}

export default handleDuplicateError
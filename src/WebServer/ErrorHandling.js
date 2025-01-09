const filterError = (error) => {
    // Handle invalid ObjectId (CastError) errors
    if (error.name === 'CastError')
        throw {statusCode: 404, message: `Invalid format: ${error.value}`};
    
    // Handle MongoDB ValidationError (e.g., schema validation issues)
    if (error.name === 'ValidationError')
        throw {statusCode: 400, message: `${Object.values(error.errors).map(err => err.message).join(', ')}`};
    
    // Handle Duplicate Key Error (MongoDB)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]; // Get the field that caused the error
        throw {statusCode: 400, message: `Duplicate value for field: ${field}`};
    }
    
    // If the error has a status code or a message, just pass it on, else bad request
    const message = error.message ? ` ${error.message}` : "";
    if (error.statusCode) {
        throw {statusCode: error.statusCode, message: message};
    } else {
        throw {statusCode: 400, message: `Bad Request${message}`};
    }
};

module.exports = { filterError };

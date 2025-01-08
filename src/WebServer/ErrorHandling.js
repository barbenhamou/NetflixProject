const errorCatch = (error) => {
    
    // Handle invalid ObjectId (CastError) errors
    if (error.name === 'CastError') throw {statusCode: 400, message: `Invalid ID format: ${error.value}`};
    
    // Handle MongoDB ValidationError (e.g., schema validation issues)
    if (error.name === 'ValidationError') throw {statusCode: 400, message: `Validation error: ${Object.values(error.errors).map(err => err.message).join(', ')}`};
    
    // Handle Duplicate Key Error (MongoDB)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]; // Get the field that caused the error
        throw {statusCode: 400, message: `Duplicate value for field: ${field}`};
    }
    
    // Check for custom errors with `statusCode` and `message`
    if (error.statusCode && error.message) throw {statusCode: error.statusCode, message: error.message};
    
    // Default case for unhandled errors
    throw {statusCode: 400, message: 'Bad Request'};
};

module.exports = { errorCatch };

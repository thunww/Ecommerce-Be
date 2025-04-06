const formatResponse = (success, message, data = null, statusCode = 200) => {
    return {
        success,
        message,
        data,
        statusCode
    };
};

const successResponse = (message, data = null, statusCode = 200) => {
    return formatResponse(true, message, data, statusCode);
};

const errorResponse = (message, statusCode = 400) => {
    return formatResponse(false, message, null, statusCode);
};

module.exports = {
    formatResponse,
    successResponse,
    errorResponse
}; 
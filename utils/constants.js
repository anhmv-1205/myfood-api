module.exports = Object.freeze({
    /**
     * Success 2xx
     */
    STATUS_200: 'success',
    MESSAGE_SUCCESS: 'ok',
    MESSAGE_204: 'Data empty',
    STATUS_204: 'Not ok',
    MESSAGE_UPDATED: 'resource updated successfully',
    MESSAGE_DELETED: 'resource deleted successfully',
    /**
     * Error 4xx, 5xx 
     */
    STATUS_400: 'Bad Request',
    MESSAGE_400: 'Bad request',
    MESSAGE_401: 'Authentication failed. Invalid user or password.',
    MESSAGE_404: 'Not Found Error',
    STATUS_ERROR: 'fail',
    MESSAGE_UNAUTHORIZED: 'Unauthorized user!',
    MESSAGE_DELETE: 'Delete successful!',
    MESSAGE_NOT_FOUND: 'Not found!',
    MESSAGE_UNKNOWN_SEVER_ERROR: 'Unknown server error!',
    MESSAGE_500: 'error',
    MESSAGE_INVALID_PASSWORD: 'Invalid password. Password validation is at least 6 character!',
    MESSAGE_ERROR_DUPLICATE: 'ERROR_DUPLICATE',
    /* Number */
    AMOUNT_ITEM_IN_PER_PAGE: 10,
    MESSAGE_OUT_OF_FOOD: "Sản phẩm đã hết hàng!",

    /* String */
    MY_FOOD_URL: 'http://localhost:3000/',
    PATH_IMG: 'images/',
    PATH_PUBLIC: 'public/',
    /* Order status */
    REQUESTING: 'Requesting',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELED: 'Canceled',
    DONE: 'Done',

    /* Time */
    AM : "AM",
    /* Food */

    /* Role */
    ROLE_ADMIN : 1,
    ROLE_FARMER : 2,
    ROLE_BUYER : 3
});
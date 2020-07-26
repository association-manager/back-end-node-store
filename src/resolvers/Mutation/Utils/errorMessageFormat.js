export const errorMessage =  async (validate) => {
    let errorObject = validate.error.details.reduce((acc, current) => {
        const key = current.path.join('.');
        acc[key] = current.message;
        return acc
    }, {})
    let errorMessage = '';
    console.log(errorObject);
    for (const key in errorObject) {
        errorMessage = errorObject[key] + ', ' + errorMessage;
    }
    return errorMessage;
}

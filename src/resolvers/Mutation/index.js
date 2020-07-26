import login from './auth/login'
import forgotPassword from './auth/forgotPassword'
import register from './register'
import createSale from './createSale';
import createProduct from './createProduct';
import resetPassword from './auth/resetPassword'
import payment from './payment'
import contactFront from './sendEmail/contactFront'

export default {
    createProduct,
    register,
    login,
    createSale,
    forgotPassword,
    resetPassword,
    payment,
    contactFront
}

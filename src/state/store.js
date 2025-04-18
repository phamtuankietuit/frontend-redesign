import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import chatReducer from './chat/chat.slice';
import productReducer from './product/product.slice';
import addressReducer from './address/address.slice';
import checkoutReducer from './checkout/checkout.slice';
import productTypeReducer from './product-type/product-type.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        chat: chatReducer,
        productType: productTypeReducer,
        address: addressReducer,
        checkout: checkoutReducer,
    }
});

export default store; 
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import chatReducer from './chat/chat.slice';
import productReducer from './product/product.slice';
import addressReducer from './address/address.slice';
import checkoutReducer from './checkout/checkout.slice';
import productTypeReducer from './product-type/product-type.slice';
import cartReducer from './cart/cart.slice';
import searchReducer from './search/search.slice';
import campaignReducer from './campaign/campaign.slice';
import promotionReducer from './promotion/promotion.slice';
import orderReducer from './order/order.slice';
import homeReducer from './home/home.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        chat: chatReducer,
        productType: productTypeReducer,
        address: addressReducer,
        checkout: checkoutReducer,
        cart: cartReducer,
        search: searchReducer,
        campaign: campaignReducer,
        promotion: promotionReducer,
        order: orderReducer,
        home: homeReducer,
    },
});

export default store; 
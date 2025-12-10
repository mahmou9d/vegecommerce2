import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./authSlice";
import authSec from "./authSecSlice";
import product from "./productSlice";
import cart from "./cartSlice";
import wishlist from "./wishlistSlice";
import review from "./reviewSlice";
import reviewget from "./reviewgetSlice";
import Getwishlists from "./GetwishlistSlice";
// import editingProduct from "./editingProductSlice";
import OrderLatest from "./OrderLatestSlice";
import Users from "./SumUsersSlice";
import Totalsales from "./TotalsalesSlice";
import TopSelling from "./TopSellingSlice";
import Totalstock from "./TotalstockSlice";
import Orders from "./OrderSlice";
import SalesOrders from "./SalesOrdersSlice";
import GetSumProducts from "./ProductsSlice";
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const rootReducer = combineReducers({
    auth,
    authSec,
    product,
    cart,
    wishlist,
    review,
    Getwishlists,
    reviewget,
    // editingProduct,
    OrderLatest,
    Users,
    Totalsales,
    TopSelling,
    Totalstock,
    Orders,
    SalesOrders,
    GetSumProducts
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

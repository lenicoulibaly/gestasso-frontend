// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/administration/security/userSlice';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import fncReducer from "./slices/administration/security/fncSlice";
import menuReducer from "./slices/menu";
import typeReducer from "./slices/administration/params/typeSlice";
import roleReducer from "./slices/administration/security/roleSlice";
import assoReducer from "./slices/administration/params/assoSlice";
import privilegeReducer from "./slices/administration/security/privilegeSlice";
import feedBackReducer from "./slices/feedBackSlice";
import backdropReducer from "./slices/backdropSlice";
import transferListReducer from "./slices/transferListSlice";
import membreReducer from "./slices/production/membres/cotisationsSlice";
import cotisationReducer from "./slices/production/cotisations/cotisationsSlice";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    fnc: fncReducer,
    menu: menuReducer,
    type: typeReducer,
    role: roleReducer,
    asso: assoReducer,
    privilege: privilegeReducer,
    feedBack: feedBackReducer,
    backdrop: backdropReducer,
    transferList: transferListReducer,
    membre: membreReducer,
    cotisation: cotisationReducer
});

export default reducer;

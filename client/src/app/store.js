import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../featutes/user/userSlice.js'
import connectionsReducer from '../featutes/connections/connectionSlice.js'
import messagesReducer from '../featutes/messages/messagesSlice.js'

export const store = configureStore({
    reducer:{
        user:userReducer,
        connections: connectionsReducer,
        messages : messagesReducer
    }
})
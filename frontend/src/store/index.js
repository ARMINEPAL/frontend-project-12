import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';

export default configureStore({
  reducer: {
    chat: chatReducer,
  },
});

import { configureStore } from '@reduxjs/toolkit';
import episodeReducer from './episodeSlice';

const store = configureStore({
  reducer: {
    episodes: episodeReducer,
  },
});

export default store;

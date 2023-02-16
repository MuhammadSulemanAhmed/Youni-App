import {configureStore} from '@reduxjs/toolkit';
import profileReducer from '../slices/profileSlice';
import mySocietiesReducer from '../slices/mySocietiesSlice';
import myChatRoomsReducer from '../slices/myChatRoomSlice';

export default configureStore({
  reducer: {
    profile: profileReducer,
    mySocieties: mySocietiesReducer,
    myChatrooms: myChatRoomsReducer,
  },
});

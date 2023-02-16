import {createSlice} from '@reduxjs/toolkit';

export const myChatRoomsSlice = createSlice({
  name: 'myChatrooms',
  initialState: {
    chatrooms: [],
  },
  reducers: {
    setChatrooms: (state, action) => {
      state.chatrooms = action.payload || [];
    },
    createNewChatroom: (state, action) => {
      state.chatrooms = [action.payload, ...state.chatrooms];
    },
    updateMessages: (state, action) => {
      let chatId = action.payload.chatId;
      let message = action.payload.message;
      let chatrooms = state.chatrooms.map(item => {
        if (item.id === chatId) {
          item.last_message = message;
          return item;
        }
        return item;
      });
      state.chatrooms = chatrooms;
    },
  },
});

export const {
  createNewChatroom,
  setChatrooms,
  updateMessages,
} = myChatRoomsSlice.actions;
export const selectChatRooms = state => state.myChatrooms.chatrooms;

export default myChatRoomsSlice.reducer;

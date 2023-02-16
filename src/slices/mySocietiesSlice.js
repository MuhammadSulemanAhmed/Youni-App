import {createSlice} from '@reduxjs/toolkit';

export const mySocietiesSlice = createSlice({
  name: 'mySocieties',
  initialState: {
    societies: [],
  },
  reducers: {
    setMySocieties: (state, action) => {
      // console.log('My Society Slice', 'setSociety', action.payload);
      state.societies = action.payload || [];
    },
  },
});

export const {setMySocieties} = mySocietiesSlice.actions;
export const selectMySocieties = state => state.mySocieties.societies;

export default mySocietiesSlice.reducer;

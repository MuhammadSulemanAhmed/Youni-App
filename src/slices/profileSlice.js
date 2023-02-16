import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: {
      first_name: "",
      last_name: "",
      email: "",
      school: "",
      phone: "",
      society: null,
      jcr: "",
      avatar_url: null,
      photos: null,
    },
    ticketid: null,
  },
  reducers: {
    setName: (state, action) => {
      state.profile.first_name = action.payload.first_name;
      state.profile.last_name = action.payload.last_name;
    },
    setEmail: (state, action) => {
      state.profile.email = action.payload;
    },
    setPicture: (state, action) => {
      state.profile.avatar_url = action.payload;
    },
    setSchool: (state, action) => {
      state.profile.school = action.payload;
    },
    setPhone: (state, action) => {
      state.profile.phone = action.payload;
    },
    setSociety: (state, action) => {
      state.profile.society = action.payload;
    },
    setJCR: (state, action) => {
      state.profile.jcr = action.payload;
    },
    setProfile: (state, action) => {
      // console.log('Profile Slice', 'setProfile', action.payload);
      state.profile = action.payload;
    },
    setPhotos: (state, action) => {
      state.profile.photos =
        state.profile.photos?.length > 0
          ? [...state.profile.photos, ...action.payload]
          : [...action.payload];
    },
    setTicketid: (state, action) => {
      state.ticketid = action.payload;
    },
  },
});

export const {
  setName,
  setEmail,
  setSchool,
  setPhone,
  setSociety,
  setProfile,
  setJCR,
  setPicture,
  setTicketid,
  setPhotos,
} = profileSlice.actions;
export const selectProfile = (state) => state.profile.profile;
export const selectProfileId = (state) => state.profile.profile.id;
export const selectFirstName = (state) => state.profile.profile.first_name;
export const selectPicture = (state) => state.profile.profile.avatar_url;
export const selectLastName = (state) => state.profile.profile.last_name;
export const selectEmail = (state) => state.profile.profile.email;
export const selectSchool = (state) => state.profile.profile.school;
export const selectPhone = (state) => state.profile.profile.phone;
export const selectSociety = (state) => state.profile.profile.society;
export const selectPhotos = (state) => state.profile.profile.photos;
export const selectJCR = (state) => state.profile.profile.jcr;
export const selectTicketid = (state) => state.profile.ticketid;

export default profileSlice.reducer;

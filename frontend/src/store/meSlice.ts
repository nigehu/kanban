import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../interfaces/IUser";

interface MeState {
  value: IUser | undefined;
}

const initialState: MeState = {
  value: undefined,
};

export const counterSlice = createSlice({
  name: "me",
  initialState: initialState,
  reducers: {
    setMe: (state, action: PayloadAction<IUser>) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMe } = counterSlice.actions;

export default counterSlice.reducer;

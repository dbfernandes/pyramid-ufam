import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  time: 0
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    tick: (state) => {
      const time = state.time + 1;
      return {
        ...state,
        time
      };
    },
  }
});

export const { tick } = timerSlice.actions;
export default timerSlice.reducer;
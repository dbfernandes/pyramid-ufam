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
    resetTimer: (state) => {
      return {
        ...state,
        time: 0
      };
    }
  }
});

export const { tick, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
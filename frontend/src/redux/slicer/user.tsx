import { createSlice } from "@reduxjs/toolkit";
import IUserLogged from "interfaces/IUserLogged";

const initialState: IUserLogged = {
  id: -1,
  name: "",
  email: "",
  cpf: "",
  userTypeId: -1,
  profileImage: "",

  courses: [],
  selectedCourse: null,

  logged: false,
  token: "",
  refreshToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, payload) => {
      const { id, name, email, cpf, userTypeId, profileImage, courses } = payload.payload;
      return {
        ...state,
        id,
        name,
        email,
        cpf,
        userTypeId,
        profileImage,
        courses,
        logged: true,
      };
    },
    logout: () => {
      return initialState;
    },
    authorize: (state, payload) => {
      const { token, refreshToken } = payload.payload;
      return {
        ...state,
        token,
        refreshToken,
      };
    },
    setCourses: (state, payload) => {
      return {
        ...state,
        courses: payload.payload,
      };
    },
    defaultCourse: (state, course) => {
      return {
        ...state,
        selectedCourse: course.payload,
      };
    },
    setProfileImage: (state, payload) => {
      return {
        ...state,
        profileImage: payload.payload,
      };
    }
  },
});

export const {
  login,
  logout,
  authorize,
  setCourses,
  defaultCourse,
  setProfileImage
} = userSlice.actions;
export default userSlice.reducer;

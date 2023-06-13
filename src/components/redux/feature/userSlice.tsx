import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  auth,
  updateUserDatabase,
  getUserFromDatabase,
} from "../../../helpers/db";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { RootState } from "../store";
const initialValues: UserValues = {
  name: "",
  email: "",
  password: "",
  profileImage: "",
  designation: "",
  github: "",
  linkedin: "",
  uid: "",
};

const initialState = {
  userDetails: initialValues,
  authenticate: false,
  loading: false,
  error: null,
};

interface UserValues {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  designation?: string;
  github?: string;
  linkedin?: string;
  uid?: string;
}

interface userValues {
  name?: string;
  email?: string;
  profileImage?: string;
  designation?: string;
  github?: string;
  linkedin?: string;
}

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (values: UserValues, { rejectWithValue }) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        values.email!,
        values.password!
      );
      const userId = response.user.uid;

      await updateUserDatabase(
        { name: values.name, email: values.email },
        userId
      );

      return { name: values.name, email: values.email, uid: userId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (values: UserValues, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email!, values.password!);
      return { email: values.email };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk action to fetch user details from the database
export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (uid: string, thunkAPI) => {
    try {
      const userDetails = await getUserFromDatabase(uid);
      return userDetails;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk action to update user details in the database
export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async ({ user, uid }: { user: userValues; uid: string }, thunkAPI) => {
    try {
      await updateUserDatabase(user, uid);
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userDetails = initialValues;
      state.authenticate = false;
    },
    resetUser: (state) => {
      state.userDetails = initialValues;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.authenticate = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.authenticate = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload!;
        state.authenticate = true;
      })
      .addCase(fetchUserDetails.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.userDetails = initialValues;
        state.authenticate = false;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetUser } = userSlice.actions;

export const selectUserDetails = (state: RootState) => state.user.userDetails;
export const selectAuthenticate = (state: RootState) => state.user.authenticate;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;

export default userSlice.reducer;

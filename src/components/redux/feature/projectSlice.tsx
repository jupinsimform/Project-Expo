import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProjectInDatabase,
  updateProjectInDatabase,
} from "../../../helpers/db";
import { RootState } from "../store";

interface Project {
  thumbnail?: string;
  title?: string;
  overview?: string;
  github?: string;
  link?: string;
  points?: string[];
  pid?: string;
  likes?: string[];
  refUser?: string;
}

interface ProjectState {
  project: Project;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  project: {},
  loading: false,
  error: null,
};

export const addOrUpdateProject = createAsyncThunk(
  "project/addOrUpdateProject",
  async (project: Project, thunkAPI) => {
    try {
      if (project.pid) {
        await updateProjectInDatabase(project, project.pid);
      } else {
        await addProjectInDatabase(project);
      }
      return project;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOrUpdateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(addOrUpdateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const selectProjectDetails = (state: RootState) => state.project.project;
export const selectPLoading = (state: RootState) => state.project.loading;
export const selectPError = (state: RootState) => state.project.error;

export default projectSlice.reducer;

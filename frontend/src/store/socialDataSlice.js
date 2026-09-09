import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPostsAPI } from "../api/post.api";
import { disconnectSocialPlatformAPI, getSocialAccountsAPI } from "../api/social.api";
import api from "../api/axios";

const initialState = {
    accounts: [],
    posts: [],
    loading: true,
};

export const loadAccounts = createAsyncThunk("socialData/loadAccounts", async () => {
    try {
        const res = await getSocialAccountsAPI();
        return Array.isArray(res.data) ? res.data : [];
    } catch {
        return [];
    }
});

export const loadPosts = createAsyncThunk(
    "socialData/loadPosts",
    async (nextAccounts, { getState }) => {
        const accounts = nextAccounts || getState().socialData.accounts;
        const hasConnected = accounts.some((account) => account.connected);
        if(!hasConnected) return [];

        try {
            const res = await getPostsAPI();
            return Array.isArray(res.data) ? res.data : [];
        } catch {
            return [];
        }
    }
);

export const refresh = createAsyncThunk("socialData/refresh", async (_,{dispatch}) => {
  const accounts = await dispatch(loadAccounts()).unwrap();
  await dispatch(loadPosts(accounts)).unwrap();
  return accounts;
});

export const disconnectPlatform = createAsyncThunk(
    "socialData/disconnectPlatform",
    async (platform, { dispatch }) => {
        if (platform === "linkedin"){
            await api.post("/api/linkedin/disconnect");
        } else {
            await disconnectSocialPlatformAPI(platform);
        }

        const accounts = await dispatch(loadAccounts()).unwrap();
        await dispatch(loadPosts(accounts)).unwrap();
        return platform;
    }
);

const socialDataSlice = createSlice({
    name: "socialData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(loadAccounts.fulfilled, (state, action) => {
            state.accounts = action.payload;
          })
          .addCase(loadPosts.fulfilled, (state, action) => {
              state.posts = action.payload;
          })
          .addCase(refresh.pending, (state) => {
            state.loading = true;
          })
          .addCase(refresh.fulfilled, (state) => {
            state.loading = false;
          })
          .addCase(refresh.rejected, (state) => {
            state.loading = false;
          });
    },
});

export default socialDataSlice.reducer;
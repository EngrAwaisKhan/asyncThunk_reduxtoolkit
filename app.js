const {
  createAsyncThunk,
  createSlice,
  configureStore,
} = require('@reduxjs/toolkit');
const axios = require('axios');

const API = 'https://jsonplaceholder.typicode.com/posts';

// initialState
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// create async thunk
const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(API);
  return response.data;
});

// create slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  extraReducers: (builder) => {
    // handling lifecycle pending, success, rejected

    // pending
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
    });

    //success
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      (state.posts = action.payload), (state.loading = false);
    });

    // rejected
    builder.addCase(fetchPosts.rejected, (state, action) => {
      (state.loading = false),
        (state.posts = []),
        (state.error = action.payload);
    });
  },
});

const postReducer = postSlice.reducer;

// store

const store = configureStore({
  reducer: postReducer,
});

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(fetchPosts());

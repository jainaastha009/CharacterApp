import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching episodes
export const fetchEpisodes = createAsyncThunk(
  'episodes/fetchEpisodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://rickandmortyapi.com/api/episode');
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error fetching episodes');
    }
  }
);

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://rickandmortyapi.com/api/character');
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error fetching characters');
    }
  }
);

export const fetchEpisodeCharacters = createAsyncThunk(
  'episodes/fetchEpisodeCharacters',
  async (episode, { rejectWithValue }) => {
    try {
      const characters = [];
      for (const url of episode.characters) {
        const response = await axios.get(url);
        characters.push(response.data);
      }
      return { characters, episodeId: episode.id };
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error fetching characters');
    }
  }
);

const episodeSlice = createSlice({
  name: 'episodes',
  initialState: {
    episodes: [],
    characters: [],
    selectedEpisode: null,
    loading: false,
    error: null, // Error state
  },
  reducers: {
    resetCharacters: (state) => {
      state.selectedEpisode = null;
      state.error = null; // Clear error on reset
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.episodes = action.payload;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.characters = action.payload;
      })
      .addCase(fetchEpisodeCharacters.fulfilled, (state, action) => {
        state.characters = action.payload.characters;
        state.selectedEpisode = action.payload.episodeId;
      })
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload; // Store the error message
        }
      );
  },
});

export const { resetCharacters } = episodeSlice.actions;
export default episodeSlice.reducer;

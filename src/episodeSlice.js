import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching episodes
export const fetchEpisodes = createAsyncThunk('episodes/fetchEpisodes', async () => {
  const response = await axios.get('https://rickandmortyapi.com/api/episode');
  return response.data.results;
});

export const fetchCharacters = createAsyncThunk('characters/fetchCharacters', async () => {
  const response = await axios.get('https://rickandmortyapi.com/api/character');
  return response.data.results;
});

export const fetchEpisodeCharacters = createAsyncThunk('episodes/fetchEpisodeCharacters', async (episode) => {
  const characterPromises = episode.characters.map(url => axios.get(url));
  const responses = await Promise.all(characterPromises);
  return { characters: responses.map(res => res.data), episodeId: episode.id };
});

const episodeSlice = createSlice({
  name: 'episodes',
  initialState: {
    episodes: [],
    characters: [],
    selectedEpisode: null,
    loading: false,
  },
  reducers: {
    resetCharacters: (state) => {
      state.selectedEpisode = null;
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
      });
  },
});

export const { resetCharacters } = episodeSlice.actions;
export default episodeSlice.reducer;

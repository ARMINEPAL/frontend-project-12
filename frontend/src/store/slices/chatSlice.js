import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.channels = action.payload.channels;
      state.messages = action.payload.messages;
      state.currentChannelId = action.payload.currentChannelId;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      const exists = state.channels.some(
        (channel) => channel.id === action.payload.id,
      );
      if (!exists) {
        state.channels.push(action.payload);
      }

      state.currentChannelId = action.payload.id;
    },
    addChannelFromSocket: (state, action) => {
      const exists = state.channels.some(
        (channel) => channel.id === action.payload.id,
      );
      if (!exists) {
        state.channels.push(action.payload);
      }
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;

      state.channels = state.channels.filter((channel) => channel.id !== id);
      state.messages = state.messages.filter(
        (message) => message.channelId !== id,
      );

      if (state.currentChannelId === id) {
        const generalChannel = state.channels.find(
          (channel) => channel.name === 'general',
        );
        state.currentChannelId = generalChannel?.id ?? null;
      }
    },
    renameChannel: (state, action) => {
      const channel = state.channels.find((c) => c.id === action.payload.id);
      if (channel) {
        channel.name = action.payload.name;
      }
    },
  },
});

export const {
  setData,
  addMessage,
  setCurrentChannelId,
  addChannel,
  addChannelFromSocket,
  removeChannel,
  renameChannel,
} = chatSlice.actions;
export default chatSlice.reducer;

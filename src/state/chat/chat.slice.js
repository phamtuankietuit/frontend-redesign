import { createSlice } from "@reduxjs/toolkit";

import {
  getMessagesAsync,
  createMessageAsync,
  getConversationAsync,
  updateConversationReadAsync,
} from "src/services/chat/chat.service";

const initialState = {
  conversation: {},
  messages: [],
  tableFiltersMessages: {
    pageNumber: 1,
    pageSize: 20,
  },
  loading: false,
  totalPages: 0,
  addTop: false,
  mIsEnd: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setTableFiltersMessages: (state, action) => {
      state.tableFiltersMessages = {
        ...state.tableFiltersMessages,
        ...action.payload,
      };
    },
    addNewMessageSocket: (state, action) => {
      state.messages.push(action.payload);
    },
    increaseUnreadCount: (state) => {
      state.conversation.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // getConversationAsync
      .addCase(getConversationAsync.fulfilled, (state, action) => {
        state.conversation = action.payload;
      })

      // getMessagesAsync
      .addCase(getMessagesAsync.pending, (state) => {
        state.loading = true;
      }).addCase(getMessagesAsync.fulfilled, (state, action) => {
        state.messages.unshift(...action.payload.messages);
        state.loading = false;

        state.addTop = !state.addTop;

        if (action.payload.messages.length === 0) {
          state.mIsEnd = true;
        }
      })


      // createMessageAsync
      .addCase(createMessageAsync.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })

      // updateConversationReadAsync
      .addCase(updateConversationReadAsync.fulfilled, (state, action) => {
        if (state.conversation) {
          state.conversation.unreadCount = 0;
        }
      })
      ;
  },
});

export const { setTableFiltersMessages, addNewMessageSocket, increaseUnreadCount } = chatSlice.actions;

export const selectChat = (state) => state.chat;

export default chatSlice.reducer;

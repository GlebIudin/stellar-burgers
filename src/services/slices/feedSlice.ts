import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, getFeedsApi } from '@api';

type TFeedState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
};

export const initialState: TFeedState = {
  orders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0
};

export const fetchFeeds = createAsyncThunk('feed/getAllFeeds', getFeedsApi);

export const fetchUserOrders = createAsyncThunk(
  'feed/getUserOrders',
  getOrdersApi
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/getOrderDetails',
  (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

const processFeedsResponse = (state: TFeedState, response: any) => {
  state.orders = response.orders;
  state.total = response.total;
  state.totalToday = response.totalToday;
};

const processOrderResponse = (state: TFeedState, order: any) => {
  if (!state.orders.some((o) => o._id === order._id)) {
    state.orders = [order, ...state.orders];
  }
};

const handlePending = (state: TFeedState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: TFeedState, error: any) => {
  state.loading = false;
  state.error = error?.message || 'Request failed';
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (reducer) => {
    reducer
      .addCase(fetchFeeds.pending, handlePending)
      .addCase(fetchFeeds.fulfilled, (state, { payload }) => {
        state.loading = false;
        processFeedsResponse(state, payload);
      })
      .addCase(fetchFeeds.rejected, (state, { error }) => {
        handleRejected(state, error);
      })
      .addCase(fetchUserOrders.pending, handlePending)
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload;
      })
      .addCase(fetchUserOrders.rejected, (state, { error }) => {
        handleRejected(state, error);
      })
      .addCase(fetchOrderByNumber.pending, handlePending)
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.loading = false;
        processOrderResponse(state, payload.orders[0]);
      })
      .addCase(fetchOrderByNumber.rejected, (state, { error }) => {
        handleRejected(state, error);
      });
  }
});

export default feedSlice.reducer;

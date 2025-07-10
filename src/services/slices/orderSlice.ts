import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { orderBurgerApi } from '@api';

export interface OrderState {
  order: TOrder | null;
  orders: TOrder[];
  name: string | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
  orderModalOpen: boolean;
  success: boolean;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  name: null,
  orderNumber: null,
  loading: false,
  error: null,
  orderModalOpen: false,
  success: false
};

const asyncHandlers = {
  startLoading: (state: OrderState) => {
    state.loading = true;
    state.error = null;
  },
  handleError: (
    state: OrderState,
    action: { payload?: unknown; error?: { message?: string } }
  ) => {
    state.loading = false;
    state.error =
      typeof action.payload === 'string'
        ? action.payload
        : action.error?.message || 'Ошибка при выполнении операции';
  }
};

const ORDER_ERRORS = {
  ORDER_FAILED: 'Заказ не был оформлен',
  MISSING_AUTH: 'Войдите в систему, чтобы сделать заказ',
  MISSING_BUN: 'Добавьте булку в бургер'
} as const;

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { bun, ingredients } = state.burgerConstructor;
    const { isAuthenticated } = state.user;

    if (!isAuthenticated) {
      return rejectWithValue(ORDER_ERRORS.MISSING_AUTH);
    }

    if (!bun) {
      return rejectWithValue(ORDER_ERRORS.MISSING_BUN);
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    try {
      return await orderBurgerApi(ingredientsIds);
    } catch (error) {
      return rejectWithValue(ORDER_ERRORS.ORDER_FAILED);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, { payload }: PayloadAction<TOrder[]>) => ({
      ...state,
      orders: payload
    }),
    openOrderModal: (state) => ({
      ...state,
      orderModalOpen: true
    }),
    closeOrderModal: (state) => ({
      ...state,
      orderModalOpen: false,
      orderNumber: null,
      order: null,
      name: null
    })
  },
  extraReducers: (builder) => {
    const handlePending = (state: OrderState) => ({
      ...state,
      loading: true,
      error: null
    });

    const handleFulfilled = (
      state: OrderState,
      { payload }: PayloadAction<{ order: TOrder; name: string }>
    ) => ({
      ...state,
      loading: false,
      order: payload.order,
      name: payload.name,
      orderNumber: payload.order.number,
      orderModalOpen: true,
      orders: [...state.orders, payload.order]
    });

    const handleRejected = (
      state: OrderState,
      action: { error?: { message?: string } }
    ) => ({
      ...state,
      loading: false,
      error: action.error?.message || 'Произошла ошибка'
    });

    builder
      .addCase(sendOrder.pending, handlePending)
      .addCase(sendOrder.fulfilled, handleFulfilled)
      .addCase(sendOrder.rejected, handleRejected);
  }
});

export const { openOrderModal, closeOrderModal, setOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
export const selectOrderNumber = (state: RootState) =>
  state.order.order?.number;

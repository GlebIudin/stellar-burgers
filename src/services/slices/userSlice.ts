import { registerUserApi } from './../../utils/burger-api';
import { TUser } from '@utils-types';
import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import {
  TLoginData,
  loginUserApi,
  logoutApi,
  updateUserApi,
  getOrdersApi
} from '@api';

import { TOrder } from '@utils-types';

export interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  orders: TOrder[];
  ordersLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  orders: [],
  ordersLoading: false
};

export const USER_ERROR_MESSAGES = {
  LOGIN_ERROR: 'Ошибка логина в систкему',
  REGISTER_ERROR: 'Ошибка регистрации',
  UPDATE_ERROR: 'Ошибка обновления информации профиля',
  ORDERS_ERROR: 'Ошибка загрузки информации о заказах'
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

const saveTokens = (refresh: string, access: string) => {
  localStorage.setItem('refreshToken', refresh);
  setCookie('accessToken', access);
};

const removeTokens = () => {
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const { refreshToken, accessToken, user } = await loginUserApi(data);
    saveTokens(refreshToken, accessToken);
    return user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (regData: TRegisterData) => {
    const { refreshToken, accessToken, user } = await registerUserApi(regData);
    saveTokens(refreshToken, accessToken);
    return user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  removeTokens();
});

export const checkIsUserLogged = createAsyncThunk(
  'user/checkAuth',
  async () => (await getUserApi()).user
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (profileData: Partial<TRegisterData>) =>
    (await updateUserApi(profileData)).user
);

export const getUserOrders = createAsyncThunk(
  'user/getOrders',
  async () => await getOrdersApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state: UserState) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: UserState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleAuthSuccess = (state: UserState, user: TUser) => {
      state.isLoading = false;
      state.user = user;
      state.isAuthenticated = true;
    };

    const handleError = (
      state: UserState,
      error: string | undefined,
      defaultMessage: string
    ) => {
      state.isLoading = false;
      state.error = error || defaultMessage;
    };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(
        loginUser.fulfilled,
        (state: UserState, { payload }: PayloadAction<TUser>) => {
          handleAuthSuccess(state, payload);
        }
      )
      .addCase(
        loginUser.rejected,
        (state: UserState, { error }: { error?: { message?: string } }) => {
          handleError(state, error?.message, USER_ERROR_MESSAGES.LOGIN_ERROR);
        }
      );

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(
        registerUser.fulfilled,
        (state: UserState, { payload }: PayloadAction<TUser>) => {
          handleAuthSuccess(state, payload);
        }
      )
      .addCase(
        registerUser.rejected,
        (state: UserState, { error }: { error?: { message?: string } }) => {
          handleError(
            state,
            error?.message,
            USER_ERROR_MESSAGES.REGISTER_ERROR
          );
        }
      );

    builder.addCase(logoutUser.fulfilled, (state: UserState) => {
      state.user = null;
      state.isAuthenticated = false;
      state.orders = [];
    });

    builder
      .addCase(checkIsUserLogged.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(
        checkIsUserLogged.fulfilled,
        (state: UserState, { payload }: PayloadAction<TUser>) => {
          handleAuthSuccess(state, payload);
        }
      )
      .addCase(checkIsUserLogged.rejected, (state: UserState) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    builder
      .addCase(updateUser.pending, handlePending)
      .addCase(
        updateUser.fulfilled,
        (state: UserState, { payload }: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = payload;
        }
      )
      .addCase(
        updateUser.rejected,
        (state: UserState, { error }: { error?: { message?: string } }) => {
          handleError(state, error?.message, USER_ERROR_MESSAGES.UPDATE_ERROR);
        }
      );

    builder
      .addCase(getUserOrders.pending, (state: UserState) => {
        state.ordersLoading = true;
      })
      .addCase(
        getUserOrders.fulfilled,
        (state: UserState, { payload }: PayloadAction<TOrder[]>) => {
          state.ordersLoading = false;
          state.orders = payload;
        }
      )
      .addCase(
        getUserOrders.rejected,
        (state: UserState, { error }: { error?: { message?: string } }) => {
          state.ordersLoading = false;
          state.error = error?.message || USER_ERROR_MESSAGES.ORDERS_ERROR;
        }
      );
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

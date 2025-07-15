import userReducer, {
  loginUser,
  registerUser,
  logoutUser,
  checkIsUserLogged,
  updateUser,
  getUserOrders,
  clearError,
  UserState
} from './userSlice';
import { TUser } from '@utils-types';

describe('Тестирование слайса пользователя', () => {
  const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    orders: [],
    ordersLoading: false
  };

  const mockUser: TUser = {
    email: 'smartgleb@gmail.com',
    name: 'Gleb'
  };

  const mockOrders = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Краторный space бессмертный бургер',
      createdAt: '2025-07-13T22:58:55.965Z',
      updatedAt: '2025-07-13T22:58:56.775Z',
      number: 84316
    }
  ];

  it('Установка начального состояния', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Проверка авторизации пользователя', () => {
    it('Запрос на авторизацию', () => {
      const state = userReducer(initialState, { type: loginUser.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('Успешная авторизация', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
    });

    it('Ошибка авторизации', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = userReducer(initialState, action);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('Проверка регистрации пользователя', () => {
    it('Запрос на регистрацию', () => {
      const state = userReducer(initialState, {
        type: registerUser.pending.type
      });
      expect(state.isLoading).toBe(true);
    });

    it('Успешная регистрация', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
    });

    it('Ошибка регистрации', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = userReducer(initialState, action);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('Проверка выхода пользователя из системы', () => {
    it('Успешный выход', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const state = userReducer(stateWithUser, {
        type: logoutUser.fulfilled.type
      });
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Проверка авторизации пользователя', () => {
    it('Проверка состояния авторизации', () => {
      const action = {
        type: checkIsUserLogged.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('Проверка обновления данных', () => {
    it('Успешное обновление', () => {
      const action = { type: updateUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('Проверка заказов пользователя', () => {
    it('Получение заказов', () => {
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = userReducer(initialState, action);
      expect(state.orders).toEqual(mockOrders);
    });
  });

  it('Очистка ошибки', () => {
    const stateWithError = { ...initialState, error: 'Ошибка' };
    const state = userReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });
});

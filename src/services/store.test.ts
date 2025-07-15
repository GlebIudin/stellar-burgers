import { rootReducer } from './store';

describe('rootReducer', () => {
  test('Тест rootReducer вызванного с unefined и UNKNOWN_ACTION на возвращение initial state ', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      ingredients: {
        ingredients: [],
        error: null,
        loading: false
      },
      order: {
        order: null,
        orders: [],
        name: null,
        orderNumber: null,
        loading: false,
        error: null,
        orderModalOpen: false,
        success: false
      },
      feed: {
        orders: [],
        loading: false,
        error: null,
        total: 0,
        totalToday: 0
      },
      user: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        orders: [],
        ordersLoading: false
      }
    });
  });
});

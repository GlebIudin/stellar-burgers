import feedReducer, {
  fetchFeeds,
  fetchUserOrders,
  fetchOrderByNumber,
  TFeedState
} from './feedSlice';
import { TOrder } from '@utils-types';

describe('Тестирование слайса ленты заказов', () => {
  const initialState: TFeedState = {
    orders: [],
    loading: false,
    error: null,
    total: 0,
    totalToday: 0
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Краторный space бессмертный бургер',
    createdAt: '2025-07-13T22:58:55.965Z',
    updatedAt: '2025-07-13T22:58:56.775Z',
    number: 84316
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  it('Возвращение начального состояния', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Проверка экшена fetchFeeds', () => {
    it('Установка loading=true при начале загрузки', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Сохранение данных ленты при успешной загрузке', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        orders: [mockOrder],
        loading: false,
        error: null,
        total: 100,
        totalToday: 10
      });
    });

    it('Обработка ошибки загрузки', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Проверка экшена fetchUserOrders', () => {
    it('Установка loading=true при начале загрузки', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Сохранение заказов пользователя при успешной загрузке', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orders: [mockOrder],
        loading: false
      });
    });

    it('Обработка ошибки загрузки заказов', () => {
      const errorMessage = 'Ошибка загрузки истории заказов';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Проверка экшена fetchOrderByNumber', () => {
    it('Добавление заказ в список если его нет', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual([mockOrder]);
    });
  });
});

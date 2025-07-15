import orderReducer, {
  sendOrder,
  openOrderModal,
  closeOrderModal,
  OrderState
} from './orderSlice';
import { RootState } from '../store';
import { selectOrderNumber } from './orderSlice';

describe('Тестирование слайса заказов', () => {
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

  const mockOrder = {
    order: {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Краторный space бессмертный бургер',
      createdAt: '2025-07-13T22:58:55.965Z',
      updatedAt: '2025-07-13T22:58:56.775Z',
      number: 84316
    },
    name: 'Gleb Iudin'
  };

  it('Возвращение начального состояния', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Проверка экшена sendOrder', () => {
    it('Установка loading=true при начале отправки', () => {
      const action = { type: sendOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Сохранение данных заказа при успешной отправке', () => {
      const action = {
        type: sendOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        order: mockOrder.order,
        name: mockOrder.name,
        orderNumber: mockOrder.order.number,
        orderModalOpen: true,
        orders: [mockOrder.order],
        loading: false
      });
    });

    it('Сохраненеи ошибки при неудачной отправке', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: sendOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('Проверка экшенов модального окна', () => {
    it('Открытие модального окна заказа', () => {
      const action = openOrderModal();
      const state = orderReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orderModalOpen: true
      });
    });

    it('Закрытие модального окна и сброс данных заказа', () => {
      const modifiedState = {
        ...initialState,
        orderModalOpen: true,
        order: mockOrder.order,
        name: mockOrder.name,
        orderNumber: mockOrder.order.number
      };

      const action = closeOrderModal();
      const state = orderReducer(modifiedState, action);

      expect(state).toEqual({
        ...modifiedState,
        orderModalOpen: false,
        order: null,
        name: null,
        orderNumber: null
      });
    });
  });

  describe('Проверка селекторов', () => {
    it('selectOrderNumber возвращает номер заказа', () => {
      const testState = {
        order: {
          ...initialState,
          order: { number: 12345 }
        }
      } as RootState;

      expect(selectOrderNumber(testState)).toBe(12345);
    });

    it('selectOrderNumber возвращает undefined если заказа нет', () => {
      const testState = {
        order: initialState
      } as RootState;

      expect(selectOrderNumber(testState)).toBeUndefined();
    });
  });
});

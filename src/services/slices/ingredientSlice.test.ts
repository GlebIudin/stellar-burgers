import ingredientsReducer, {
  fetchIngredients,
  TIngredientsState
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('Тестирование слайса ингредиентов', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    error: null,
    loading: false
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  it('Возвращение начального состояния', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Проверка работоспособности экшна fetchIngredients', () => {
    it('Установка loading=true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        error: null,
        loading: true
      });
    });

    it('Сохранение ингредиентов и завершение загрузки при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: mockIngredients,
        error: null,
        loading: false
      });
    });

    it('Сохранение ошибки и завершение загрузки при rejected', () => {
      const errorMessage = 'Ошибка загрузки данных';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ingredients: [],
        error: errorMessage,
        loading: false
      });
    });
  });
});

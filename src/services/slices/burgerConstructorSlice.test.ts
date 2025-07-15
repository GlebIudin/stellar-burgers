import constructorReducer, {
  addBurgerIngredient,
  moveBurgerIngredient,
  removeBurgerIngredient,
  resetBurgerConstructor,
  TConstructorState
} from './burgerConstructorSlice';
import { TIngredient } from '../../utils/types';

describe('Тестирование слайса конструктора', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
  };

  const mockIngredient1: TIngredient = {
    _id: '2',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png'
  };

  const mockIngredient2: TIngredient = {
    _id: '3',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png'
  };

  it('Возвращение начального состояния', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Обработка экшена добавления ингредиента', () => {
    it('Добавление булки', () => {
      const action = addBurgerIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual({
        ...mockBun,
        id: expect.any(String)
      });
      expect(state.ingredients).toEqual([]);
    });

    it('Добавление начинки', () => {
      const action = addBurgerIngredient(mockIngredient1);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockIngredient1,
        id: expect.any(String)
      });
    });
  });

  describe('Обработка экшена удаления ингредиента', () => {
    it('Удаление начинки', () => {
      let state = constructorReducer(
        initialState,
        addBurgerIngredient(mockIngredient1)
      );
      const ingredientId = state.ingredients[0].id;
      state = constructorReducer(state, removeBurgerIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Обработка экшена изменения порядка ингредиентов', () => {
    it('Перемещение ингредиента вверх', () => {
      let state = constructorReducer(
        initialState,
        addBurgerIngredient(mockIngredient1)
      );
      state = constructorReducer(state, addBurgerIngredient(mockIngredient2));

      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('3');

      state = constructorReducer(
        state,
        moveBurgerIngredient({ from: 1, to: 0 })
      );

      expect(state.ingredients[0]._id).toBe('3');
      expect(state.ingredients[1]._id).toBe('2');
    });

    it('Перемещение ингредиента вниз', () => {
      let state = constructorReducer(
        initialState,
        addBurgerIngredient(mockIngredient1)
      );
      state = constructorReducer(state, addBurgerIngredient(mockIngredient2));

      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('3');

      state = constructorReducer(
        state,
        moveBurgerIngredient({ from: 0, to: 1 })
      );

      expect(state.ingredients[0]._id).toBe('3');
      expect(state.ingredients[1]._id).toBe('2');
    });
  });

  it('Сброс состояния конструктора', () => {
    let state = constructorReducer(initialState, addBurgerIngredient(mockBun));
    state = constructorReducer(state, addBurgerIngredient(mockIngredient1));

    expect(state.bun).not.toBeNull();
    expect(state.ingredients).toHaveLength(1);

    state = constructorReducer(state, resetBurgerConstructor());

    expect(state).toEqual(initialState);
  });
});

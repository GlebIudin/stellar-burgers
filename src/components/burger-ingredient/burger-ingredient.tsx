import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addBurgerIngredient } from '../../services/slices/burgerConstructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  function IngredientCard({ ingredient, count }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const constructorState = useSelector((state) => state.burgerConstructor);

    const getIngredientCount = () => {
      if (ingredient.type === 'bun') {
        return constructorState.bun?._id === ingredient._id ? 2 : 0;
      }
      return constructorState.ingredients.filter(
        (item) => item._id === ingredient._id
      ).length;
    };

    const addIngredient = () => {
      dispatch(addBurgerIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={getIngredientCount()}
        locationState={{ background: location }}
        handleAdd={addIngredient}
      />
    );
  }
);

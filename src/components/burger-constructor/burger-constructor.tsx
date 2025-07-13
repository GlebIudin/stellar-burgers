import { useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { sendOrder, closeOrderModal } from '../../services/slices/orderSlice';

export const BurgerConstructor = () => {
  const state = useSelector((state) => ({
    burgerConstructor: state.burgerConstructor,
    order: state.order,
    user: state.user
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = state.burgerConstructor;
  const { loading: orderRequest, order, orderModalOpen } = state.order;
  const { isAuthenticated } = state.user;

  const getConstructorItems = () => ({
    bun,
    ingredients: ingredients || []
  });

  const getOrderModalData = () => (orderModalOpen && order ? order : null);

  const handleCreateOrder = useCallback(() => {
    if (!bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(sendOrder());
  }, [bun, orderRequest, isAuthenticated, navigate, dispatch]);

  const closeModal = useCallback(() => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={getConstructorItems()}
      orderModalData={getOrderModalData()}
      onOrderClick={handleCreateOrder}
      closeOrderModal={closeModal}
    />
  );
};
